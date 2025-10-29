function export_csv(grid) {
    grid.save()
    const { remote } = require('electron')
    const { dialog } = remote
    const selectedPath = dialog.showSaveDialog({ filters: [{ name: "Export File", extensions: ["csv"] }] })
    const filePath = resolveDialogPath(selectedPath)
    if (!filePath) {
        w2alert('No file selected. Could not export.')
        return false
    }

    const columns = grid.columns
    let csv = ""

    let headerline = ""
    for (let i = 0; i < columns.length; i++) {
        headerline += csvEscape(columns[i].caption || columns[i].field)
        if (i < columns.length - 1) headerline += ","
    }
    csv += headerline + "\n"

    for (const record of grid.records) {
        let line = ""
        let colIndex = 0
        for (const column of columns) {
            const value = normalizeGridValue(record[column.field], column.field)
            line += csvEscape(value)
            if (colIndex < columns.length - 1) line += ","
            colIndex++
        }
        csv += line + "\n"
    }

    const fs = require("node:fs")
    w2utils.lock($("#main"), "Exporting file...", true)
    try {
        fs.writeFileSync(filePath.toString(), csv)
    } finally {
        w2utils.unlock($("#main"))
    }
    return true
}

function export_pdf(grid) {
    grid.save()
    const { remote } = require('electron')
    const { dialog, BrowserWindow } = remote
    const selectedPath = dialog.showSaveDialog({ filters: [{ name: "PDF Report", extensions: ["pdf"] }] })
    const filePath = resolveDialogPath(selectedPath)
    if (!filePath) {
        w2alert('No file selected. Could not export.')
        return false
    }

    const columns = grid.columns
    const rows = grid.records.map(function (record) {
        return columns.map(function (column) {
            return normalizeGridValue(record[column.field], column.field)
        })
    })

    const html = buildPdfHtml(grid.name, columns, rows)
    const fs = require("node:fs")
    w2utils.lock($("#main"), "Generating PDF...", true)

    const tempWindow = new BrowserWindow({
        width: 900,
        height: 1100,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    tempWindow.webContents.on('did-finish-load', function () {
        tempWindow.webContents.printToPDF({ printBackground: true }).then(function (data) {
            fs.writeFileSync(filePath.toString(), data)
            tempWindow.destroy()
            w2utils.unlock($("#main"))
            w2alert('PDF export completed.')
        }).catch(function (err) {
            tempWindow.destroy()
            w2utils.unlock($("#main"))
            w2alert('Failed to export PDF: ' + err.message)
        })
    })

    tempWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
    return true
}

function export_stix_bundle(grid) {
    grid.save()
    const { remote } = require('electron')
    const { dialog } = remote
    const selectedPath = dialog.showSaveDialog({ filters: [{ name: "STIX 2.1 Bundle", extensions: ["json"] }] })
    const filePath = resolveDialogPath(selectedPath)
    if (!filePath) {
        w2alert('No file selected. Could not export.')
        return false
    }

    const nowIso = new Date().toISOString()
    const objects = []
    const reportRefSet = new Set()
    const attackPatternMap = {}

    for (const record of grid.records) {
        const observedId = buildStixId('observed-data')
        const eventTimeIso = parseDateToIso(record.date_time, nowIso)
        const eventType = lookupOptionText(case_data.event_types, record.event_type)
        const killchain = lookupOptionText(case_data.killchain, record.killchain)
        const direction = lookupOptionText(case_data.direction, record.direction)
        const technique = resolveTechnique(record.mitre_attack)

        const observed = {
            type: 'observed-data',
            spec_version: '2.1',
            id: observedId,
            created: nowIso,
            modified: nowIso,
            first_observed: eventTimeIso,
            last_observed: eventTimeIso,
            number_observed: 1,
            description: buildEventDescription(record, eventType, killchain, technique),
            objects: {},
            x_aurora_event: {
                event_type: eventType || normalizeGridValue(record.event_type, 'event_type'),
                event_host: normalizeGridValue(record.event_host, 'event_host'),
                event_source_host: normalizeGridValue(record.event_source_host, 'event_source_host'),
                direction: direction,
                killchain: killchain,
                mitre_attack: technique ? technique.id : '',
                notes: normalizeGridValue(record.notes, 'notes')
            }
        }
        objects.push(observed)
        reportRefSet.add(observedId)

        if (technique) {
            let attackPattern = attackPatternMap[technique.id]
            if (!attackPattern) {
                const attackId = buildStixId('attack-pattern')
                attackPattern = {
                    type: 'attack-pattern',
                    spec_version: '2.1',
                    id: attackId,
                    created: nowIso,
                    modified: nowIso,
                    name: technique.text,
                    external_references: [
                        {
                            source_name: 'mitre-attack',
                            external_id: technique.id
                        }
                    ]
                }
                attackPatternMap[technique.id] = attackPattern
                objects.push(attackPattern)
                reportRefSet.add(attackId)
            }

            const relationshipId = buildStixId('relationship')
            const relationship = {
                type: 'relationship',
                spec_version: '2.1',
                id: relationshipId,
                created: nowIso,
                modified: nowIso,
                relationship_type: 'related-to',
                source_ref: observedId,
                target_ref: attackPattern.id,
                description: 'Aurora timeline event linked to MITRE ATT&CK technique.'
            }
            objects.push(relationship)
            reportRefSet.add(relationshipId)
        }
    }

    const reportId = buildStixId('report')
    const report = {
        type: 'report',
        spec_version: '2.1',
        id: reportId,
        created: nowIso,
        modified: nowIso,
        published: nowIso,
        name: case_data.case_id ? ('Aurora Case ' + case_data.case_id + ' Timeline') : 'Aurora Timeline Export',
        description: 'Timeline export from Aurora Incident Response.',
        report_types: ['incident'],
        object_refs: Array.from(reportRefSet)
    }
    objects.push(report)

    const bundle = {
        type: 'bundle',
        id: buildStixId('bundle'),
        spec_version: '2.1',
        objects: objects
    }

    const fs = require("node:fs")
    w2utils.lock($("#main"), "Exporting STIX bundle...", true)
    try {
        fs.writeFileSync(filePath.toString(), JSON.stringify(bundle, null, 2))
    } finally {
        w2utils.unlock($("#main"))
    }
    w2alert('STIX bundle exported.')
    return true
}

function resolveDialogPath(result) {
    if (!result) return undefined
    if (typeof result === 'string') return result
    if (Array.isArray(result)) return result.length ? result[0] : undefined
    if (result.canceled) return undefined
    if (result.filePath) return result.filePath
    if (result.path) return result.path
    return undefined
}

function csvEscape(value) {
    if (value === undefined || value === null) return '""'
    const str = String(value).replaceAll('"', '""')
    return '"' + str + '"'
}

function normalizeObjectValue(value) {
    if (value.text && value.id) {
        return value.id + ' - ' + value.text
    }
    if (value.text) return value.text
    if (value.value) return value.value
    return JSON.stringify(value)
}

function normalizeGridValue(value, field) {
    if (value === undefined || value === null) return ''
    if (Array.isArray(value)) {
        return value.map(function (entry) {
            return normalizeGridValue(entry, field)
        }).join(', ')
    }
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
    }
    if (typeof value === 'object') {
        return normalizeObjectValue(value)
    }
    if (typeof value === 'string' && field === 'mitre_attack') {
        const technique = findTechniqueById(value)
        if (technique) return technique.id + ' - ' + technique.text
    }
    return String(value)
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
        .replaceAll(/\r?\n/g, '<br>')
}

function buildPdfHtml(gridName, columns, rows) {
    const title = 'Aurora Export - ' + (gridName || 'Grid')
    const headers = columns.map(function (column) {
        return '<th>' + escapeHtml(column.caption || column.field) + '</th>'
    }).join('')
    const bodyRows = rows.map(function (row) {
        const cells = row.map(function (cell) {
            return '<td>' + escapeHtml(cell) + '</td>'
        }).join('')
        return '<tr>' + cells + '</tr>'
    }).join('')

    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
        '<title>' + escapeHtml(title) + '</title>' +
        '<style>' +
        'body{font-family:Arial,Helvetica,sans-serif;padding:24px;font-size:12px;color:#222;}' +
        'h1{font-size:20px;margin-bottom:16px;}' +
        'table{width:100%;border-collapse:collapse;}' +
        'th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;}' +
        'th{background-color:#f2f2f2;font-weight:bold;}' +
        'tr:nth-child(even){background-color:#fafafa;}' +
        '</style>' +
        '</head><body>' +
        '<h1>' + escapeHtml(title) + '</h1>' +
        '<table><thead><tr>' + headers + '</tr></thead><tbody>' + bodyRows + '</tbody></table>' +
        '</body></html>'
}

function parseDateToIso(value, fallbackIso) {
    if (!value) return fallbackIso
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return fallbackIso
    return parsed.toISOString()
}

function lookupOptionText(options, value) {
    if (!options || value === undefined || value === null) return ''
    const normalizedValue = typeof value === 'object' && value.id ? value.id : value
    for (const option of options) {
        if (option.id === normalizedValue || option.text === normalizedValue) {
            return option.text
        }
    }
    return ''
}

function findTechniqueById(id) {
    if (!case_data || !Array.isArray(case_data.attack_techniques)) return null
    for (const entry of case_data.attack_techniques) {
        if (entry.id === id || entry.text === id) {
            return entry
        }
    }
    return null
}

function resolveTechnique(value) {
    if (!value) return null
    if (typeof value === 'object' && value.id && value.text) return value
    if (typeof value === 'object' && value.id) {
        const resolved = findTechniqueById(value.id)
        if (resolved) return resolved
    }
    if (typeof value === 'string') {
        const resolved = findTechniqueById(value)
        if (resolved) return resolved
    }
    return null
}

function buildEventDescription(record, eventType, killchain, technique) {
    const parts = []
    if (record.date_time) parts.push('Time: ' + normalizeGridValue(record.date_time, 'date_time'))
    if (eventType) parts.push('Type: ' + eventType)
    if (record.event_host) parts.push('Event System: ' + normalizeGridValue(record.event_host, 'event_host'))
    if (record.event_source_host) parts.push('Remote System: ' + normalizeGridValue(record.event_source_host, 'event_source_host'))
    if (killchain) parts.push('Killchain: ' + killchain)
    if (technique) parts.push('MITRE ATT&CK: ' + technique.id + ' - ' + technique.text)
    if (record.event_data) parts.push('Event: ' + normalizeGridValue(record.event_data, 'event_data'))
    if (record.notes) parts.push('Notes: ' + normalizeGridValue(record.notes, 'notes'))
    return parts.join('\n')
}

function buildStixId(type) {
    return type + '--' + generateUUID()
}

function generateUUID() {
    try {
        const crypto = require('node:crypto')
        if (crypto.randomUUID) {
            return crypto.randomUUID()
        }
        const bytes = crypto.randomBytes(16)
        bytes[6] = (bytes[6] & 0x0f) | 0x40
        bytes[8] = (bytes[8] & 0x3f) | 0x80
        const hex = bytes.toString('hex')
        return (
            hex.slice(0, 8) + '-' +
            hex.slice(8, 12) + '-' +
            hex.slice(12, 16) + '-' +
            hex.slice(16, 20) + '-' +
            hex.slice(20)
        )
    } catch (err) {
        console.error('Failed to generate UUID using crypto:', err)
        // Fallback UUID generator: does NOT guarantee uniqueness or cryptographic randomness.
        // Use only for non-security-critical purposes.
        console.warn('WARNING: Using fallback UUID generator. This does NOT guarantee uniqueness or cryptographic randomness. Do not use for security-critical purposes.')
        // Use String#replaceAll for simple character replacement.
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replaceAll('x', function () {
                return Math.trunc(Math.random() * 16).toString(16)
            })
            .replaceAll('y', function () {
                return ((Math.trunc(Math.random() * 16) & 0x3) | 0x8).toString(16)
            })
    }
}
