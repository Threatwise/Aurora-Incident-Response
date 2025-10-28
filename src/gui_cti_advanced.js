/**
 * Advanced CTI UI Functions
 * Diamond Model and CTI Mode interfaces
 */

/**
 * Show Diamond Model UI
 * 4-facet analysis: Adversary, Capability, Infrastructure, Victim
 */
function showDiamondModel() {
    syncAllChanges();
    
    const diamond = case_data.diamond_model || { adversary: {}, capability: {}, infrastructure: {}, victim: {} };
    
    let html = `
        <div style="padding: 20px; max-width: 1400px;">
            <h2>Diamond Model Analysis</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                Four-facet intrusion analysis framework connecting Adversary, Capability, Infrastructure, and Victim
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                
                <!-- ADVERSARY -->
                <div style="background: #FFEBEE; border-radius: 8px; padding: 20px; border-left: 4px solid #F44336;">
                    <h3 style="margin: 0 0 15px 0; color: #D32F2F;">
                        <i class="fa fa-user-secret"></i> Adversary
                    </h3>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Threat Actor</label>
                        <input type="text" id="dm_actor" value="${diamond.adversary.actor || ''}" 
                               placeholder="e.g., APT29, FIN7" 
                               onchange="updateDiamondField('adversary', 'actor', this.value)"
                               style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Attribution Confidence</label>
                        <select id="dm_confidence" onchange="updateDiamondField('adversary', 'confidence', this.value)"
                                style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="low" ${diamond.adversary.confidence === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${diamond.adversary.confidence === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${diamond.adversary.confidence === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Motivation</label>
                        <select id="dm_motivation" onchange="updateDiamondField('adversary', 'motivation', this.value)"
                                style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="" ${!diamond.adversary.motivation ? 'selected' : ''}>Unknown</option>
                            <option value="financial" ${diamond.adversary.motivation === 'financial' ? 'selected' : ''}>Financial Gain</option>
                            <option value="espionage" ${diamond.adversary.motivation === 'espionage' ? 'selected' : ''}>Espionage</option>
                            <option value="disruption" ${diamond.adversary.motivation === 'disruption' ? 'selected' : ''}>Disruption</option>
                            <option value="ideology" ${diamond.adversary.motivation === 'ideology' ? 'selected' : ''}>Ideology/Hacktivism</option>
                        </select>
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <button onclick="viewAdversaryIndicators()" class="w2ui-btn" style="width: 100%; font-size: 12px;">
                            View Attribution Evidence
                        </button>
                    </div>
                </div>
                
                <!-- CAPABILITY -->
                <div style="background: #FFF3E0; border-radius: 8px; padding: 20px; border-left: 4px solid #FF9800;">
                    <h3 style="margin: 0 0 15px 0; color: #F57C00;">
                        <i class="fa fa-wrench"></i> Capability
                    </h3>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Primary Tools</label>
                        <div style="font-size: 11px; min-height: 40px; padding: 8px; background: white; border-radius: 4px; border: 1px solid #ddd;">
                            ${case_data.malware.slice(0, 5).map(m => m.text).join(', ') || 'None identified'}
                        </div>
                        <button onclick="w2ui.sidebar.click('malware')" class="w2ui-btn" style="width: 100%; margin-top: 5px; font-size: 11px;">
                            View All Malware
                        </button>
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Sophistication</label>
                        <select id="dm_sophistication" onchange="updateDiamondField('capability', 'sophistication', this.value)"
                                style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="low" ${diamond.capability.sophistication === 'low' ? 'selected' : ''}>Low (script kiddie)</option>
                            <option value="medium" ${diamond.capability.sophistication === 'medium' ? 'selected' : ''}>Medium (commodity tools)</option>
                            <option value="high" ${diamond.capability.sophistication === 'high' ? 'selected' : ''}>High (custom/advanced)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">TTPs Count</label>
                        <div style="font-size: 24px; font-weight: bold; color: #FF9800; text-align: center;">
                            ${Object.keys(analyzeMitreAttack()).length}
                        </div>
                    </div>
                </div>
                
                <!-- INFRASTRUCTURE -->
                <div style="background: #E8F5E9; border-radius: 8px; padding: 20px; border-left: 4px solid #4CAF50;">
                    <h3 style="margin: 0 0 15px 0; color: #388E3C;">
                        <i class="fa fa-server"></i> Infrastructure
                    </h3>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">C2 Servers</label>
                        <div style="font-size: 11px; min-height: 40px; padding: 8px; background: white; border-radius: 4px; border: 1px solid #ddd;">
                            ${case_data.network.slice(0, 5).map(n => n.ip || n.domainname).filter(x => x).join(', ') || 'None identified'}
                        </div>
                        <button onclick="w2ui.sidebar.click('network')" class="w2ui-btn" style="width: 100%; margin-top: 5px; font-size: 11px;">
                            View All Network Indicators
                        </button>
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Infrastructure Type</label>
                        <select id="dm_infra_type" onchange="updateDiamondField('infrastructure', 'type', this.value)"
                                style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="owned" ${diamond.infrastructure.type === 'owned' ? 'selected' : ''}>Adversary-Owned</option>
                            <option value="compromised" ${diamond.infrastructure.type === 'compromised' ? 'selected' : ''}>Compromised/Hijacked</option>
                            <option value="shared" ${diamond.infrastructure.type === 'shared' ? 'selected' : ''}>Shared Hosting</option>
                            <option value="cloud" ${diamond.infrastructure.type === 'cloud' ? 'selected' : ''}>Cloud Services</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Unique IPs</label>
                        <div style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center;">
                            ${new Set(case_data.network.map(n => n.ip).filter(x => x)).size}
                        </div>
                    </div>
                </div>
                
                <!-- VICTIM -->
                <div style="background: #E3F2FD; border-radius: 8px; padding: 20px; border-left: 4px solid #2196F3;">
                    <h3 style="margin: 0 0 15px 0; color: #1976D2;">
                        <i class="fa fa-building"></i> Victim
                    </h3>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Organization</label>
                        <input type="text" id="dm_org" value="${diamond.victim.organization || case_data.client || ''}" 
                               onchange="updateDiamondField('victim', 'organization', this.value)"
                               style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Industry Sector</label>
                        <select id="dm_sector" onchange="updateDiamondField('victim', 'sector', this.value)"
                                style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="">Select sector...</option>
                            <option value="financial" ${diamond.victim.sector === 'financial' ? 'selected' : ''}>Financial Services</option>
                            <option value="healthcare" ${diamond.victim.sector === 'healthcare' ? 'selected' : ''}>Healthcare</option>
                            <option value="government" ${diamond.victim.sector === 'government' ? 'selected' : ''}>Government</option>
                            <option value="technology" ${diamond.victim.sector === 'technology' ? 'selected' : ''}>Technology</option>
                            <option value="manufacturing" ${diamond.victim.sector === 'manufacturing' ? 'selected' : ''}>Manufacturing</option>
                            <option value="education" ${diamond.victim.sector === 'education' ? 'selected' : ''}>Education</option>
                            <option value="retail" ${diamond.victim.sector === 'retail' ? 'selected' : ''}>Retail</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Compromised Systems</label>
                        <div style="font-size: 24px; font-weight: bold; color: #2196F3; text-align: center;">
                            ${case_data.investigated_systems.filter(s => s.verdict === 'Compromised').length} / ${case_data.investigated_systems.length}
                        </div>
                    </div>
                    
                    <div>
                        <button onclick="w2ui.sidebar.click('systems')" class="w2ui-btn" style="width: 100%; font-size: 12px;">
                            View Affected Systems
                        </button>
                    </div>
                </div>
                
            </div>
            
            <!-- Meta Features -->
            <div style="background: #F5F5F5; border-radius: 8px; padding: 20px; margin-top: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #666;">
                    <i class="fa fa-link"></i> Meta-Features
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div>
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Timestamp</label>
                        <input type="datetime-local" id="dm_timestamp" value="${diamond.timestamp || ''}"
                               onchange="case_data.diamond_model.timestamp = this.value"
                               style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div>
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Phase</label>
                        <select id="dm_phase" onchange="case_data.diamond_model.phase = this.value"
                                style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="reconnaissance" ${diamond.phase === 'reconnaissance' ? 'selected' : ''}>Reconnaissance</option>
                            <option value="exploitation" ${diamond.phase === 'exploitation' ? 'selected' : ''}>Exploitation</option>
                            <option value="persistence" ${diamond.phase === 'persistence' ? 'selected' : ''}>Persistence</option>
                            <option value="exfiltration" ${diamond.phase === 'exfiltration' ? 'selected' : ''}>Exfiltration</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="font-size: 12px; color: #666; display: block; margin-bottom: 3px;">Result</label>
                        <select id="dm_result" onchange="case_data.diamond_model.result = this.value"
                                style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="success" ${diamond.result === 'success' ? 'selected' : ''}>Success</option>
                            <option value="failure" ${diamond.result === 'failure' ? 'selected' : ''}>Failure</option>
                            <option value="unknown" ${diamond.result === 'unknown' ? 'selected' : ''}>Unknown</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="autoPopulateDiamond()" class="w2ui-btn w2ui-btn-green">
                    Auto-Populate from Case Data
                </button>
                <button onclick="exportDiamondModel()" class="w2ui-btn">
                    Export Diamond Model
                </button>
                <button onclick="generateCTISummary()" class="w2ui-btn w2ui-btn-blue">
                    Generate CTI Report
                </button>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
                <strong>Diamond Model Framework:</strong> This analysis connects the four facets of an intrusion. 
                Changes in any facet can help identify related activity. For example, if the adversary changes their 
                infrastructure but uses the same capabilities, you can still track them.
            </div>
        </div>
    `;
    
    w2ui.main_layout.content('main', html);
}

/**
 * Update diamond model field
 */
function updateDiamondField(facet, field, value) {
    if (!case_data.diamond_model) {
        case_data.diamond_model = { adversary: {}, capability: {}, infrastructure: {}, victim: {} };
    }
    if (!case_data.diamond_model[facet]) case_data.diamond_model[facet] = {};
    case_data.diamond_model[facet][field] = value;
}

/**
 * Auto-populate Diamond Model from case data
 */
function autoPopulateDiamond() {
    syncAllChanges();
    
    if (!case_data.diamond_model) {
        case_data.diamond_model = { adversary: {}, capability: {}, infrastructure: {}, victim: {} };
    }
    
    // Victim facet
    case_data.diamond_model.victim = {
        organization: case_data.client || '',
        sector: case_data.diamond_model.victim?.sector || '',
        asset_count: case_data.investigated_systems.length,
        compromised_count: case_data.investigated_systems.filter(s => s.verdict === 'Compromised').length
    };
    
    // Capability facet
    const malwareTools = case_data.malware.map(m => m.text).filter(x => x);
    case_data.diamond_model.capability = {
        tools: malwareTools,
        tool_count: malwareTools.length,
        sophistication: case_data.diamond_model.capability?.sophistication || 'medium',
        techniques: Object.keys(analyzeMitreAttack())
    };
    
    // Infrastructure facet
    const uniqueIPs = [...new Set(case_data.network.map(n => n.ip).filter(x => x))];
    const uniqueDomains = [...new Set(case_data.network.map(n => n.domainname).filter(x => x))];
    case_data.diamond_model.infrastructure = {
        ip_addresses: uniqueIPs,
        domains: uniqueDomains,
        type: case_data.diamond_model.infrastructure?.type || 'unknown',
        ip_count: uniqueIPs.length,
        domain_count: uniqueDomains.length
    };
    
    // Adversary facet - keep existing if set
    if (!case_data.diamond_model.adversary.actor) {
        const attributions = [...new Set(case_data.timeline.map(e => e.attribution).filter(x => x))];
        case_data.diamond_model.adversary = {
            actor: attributions[0] || '',
            confidence: case_data.diamond_model.adversary?.confidence || 'low',
            motivation: case_data.diamond_model.adversary?.motivation || ''
        };
    }
    
    showDiamondModel();
    w2alert('Diamond Model populated from case data!');
}

/**
 * View adversary attribution indicators
 */
function viewAdversaryIndicators() {
    syncAllChanges();
    const attributedEvents = case_data.timeline.filter(e => e.attribution);
    
    if (attributedEvents.length === 0) {
        w2alert('No attribution data found. Add attribution information to your timeline events.');
        return;
    }
    
    w2ui.sidebar.click('timeline');
    setTimeout(() => {
        w2ui.grd_timeline.searchReset();
        w2ui.grd_timeline.search([{ field: 'attribution', value: '', operator: 'is not' }]);
    }, 100);
}

/**
 * Show CTI Mode UI
 * Threat actor profiling with attribution confidence scoring
 */
function showCTIMode() {
    syncAllChanges();
    
    const cti = case_data.cti_mode || {
        threat_actor: '',
        attribution_score: 0,
        indicators: { ttp_match: 0, tool_match: 0, infrastructure_match: 0, timing_pattern: 0, target_profile: 0 }
    };
    
    // Calculate attribution score
    const indicators = cti.indicators || {};
    const avgScore = Math.round((
        (indicators.ttp_match || 0) + 
        (indicators.tool_match || 0) + 
        (indicators.infrastructure_match || 0) + 
        (indicators.timing_pattern || 0) + 
        (indicators.target_profile || 0)
    ) / 5);
    
    let confidenceLevel = 'Low';
    let confidenceColor = '#F44336';
    if (avgScore >= 7) {
        confidenceLevel = 'High';
        confidenceColor = '#4CAF50';
    } else if (avgScore >= 4) {
        confidenceLevel = 'Medium';
        confidenceColor = '#FF9800';
    }
    
    let html = `
        <div style="padding: 20px; max-width: 1000px;">
            <h2>CTI Mode - Threat Actor Attribution</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                Score attribution confidence across 5 key indicators (0-10 scale each)
            </p>
            
            <!-- Attribution Score Summary -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 48px; font-weight: bold;">${avgScore}/10</h1>
                <div style="font-size: 24px; margin-top: 10px; opacity: 0.9;">Attribution Confidence</div>
                <div style="font-size: 16px; margin-top: 5px; padding: 5px 15px; background: rgba(255,255,255,0.2); border-radius: 20px; display: inline-block;">
                    ${confidenceLevel} Confidence
                </div>
            </div>
            
            <!-- Threat Actor Profile -->
            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #ddd;">
                <h3 style="margin: 0 0 15px 0;">Threat Actor Profile</h3>
                
                <div style="margin-bottom: 15px;">
                    <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">Threat Actor Name/Group</label>
                    <input type="text" id="cti_actor" value="${cti.threat_actor || ''}" 
                           placeholder="e.g., APT29, Lazarus Group, FIN7"
                           onchange="updateCTIField('threat_actor', this.value)"
                           style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">Primary Motivation</label>
                        <select id="cti_motivation" onchange="updateCTIField('motivation', this.value)"
                                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="">Unknown</option>
                            <option value="financial" ${cti.motivation === 'financial' ? 'selected' : ''}>Financial Gain</option>
                            <option value="espionage" ${cti.motivation === 'espionage' ? 'selected' : ''}>Cyber Espionage</option>
                            <option value="disruption" ${cti.motivation === 'disruption' ? 'selected' : ''}>Disruption/Sabotage</option>
                            <option value="ideology" ${cti.motivation === 'ideology' ? 'selected' : ''}>Ideology/Hacktivism</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">Sophistication Level</label>
                        <select id="cti_sophistication" onchange="updateCTIField('sophistication', this.value)"
                                style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="low" ${cti.sophistication === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${cti.sophistication === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${cti.sophistication === 'high' ? 'selected' : ''}>High</option>
                            <option value="advanced" ${cti.sophistication === 'advanced' ? 'selected' : ''}>Advanced/State-Sponsored</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Attribution Indicators -->
            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #ddd;">
                <h3 style="margin: 0 0 20px 0;">Attribution Indicators (0-10 scale)</h3>
                
                ${['ttp_match', 'tool_match', 'infrastructure_match', 'timing_pattern', 'target_profile'].map(indicator => {
                    const labels = {
                        ttp_match: 'TTP Match',
                        tool_match: 'Tool/Malware Match',
                        infrastructure_match: 'Infrastructure Overlap',
                        timing_pattern: 'Timing/Operational Pattern',
                        target_profile: 'Target Profile Match'
                    };
                    const descriptions = {
                        ttp_match: 'Tactics, Techniques, and Procedures match known actor patterns',
                        tool_match: 'Malware and tools match actor\'s known arsenal',
                        infrastructure_match: 'C2 servers, domains overlap with actor\'s infrastructure',
                        timing_pattern: 'Attack timing matches actor\'s operational hours/patterns',
                        target_profile: 'Victim profile matches actor\'s targeting preferences'
                    };
                    const value = indicators[indicator] || 0;
                    
                    return `
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <strong style="font-size: 14px;">${labels[indicator]}</strong>
                                    <div style="font-size: 11px; color: #999; margin-top: 2px;">${descriptions[indicator]}</div>
                                </div>
                                <div style="font-size: 20px; font-weight: bold; color: ${value >= 7 ? '#4CAF50' : value >= 4 ? '#FF9800' : '#F44336'}; min-width: 40px; text-align: right;">
                                    ${value}
                                </div>
                            </div>
                            <input type="range" min="0" max="10" value="${value}" 
                                   id="cti_${indicator}"
                                   onchange="updateCTIIndicator('${indicator}', this.value); showCTIMode();"
                                   style="width: 100%; height: 8px; border-radius: 5px; background: linear-gradient(to right, #F44336 0%, #FF9800 40%, #4CAF50 70%); outline: none; -webkit-appearance: none;">
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="suggestAttribution()" class="w2ui-btn w2ui-btn-blue">
                    Suggest Attribution (AI)
                </button>
                <button onclick="exportCTIReport()" class="w2ui-btn">
                    Export CTI Report
                </button>
                <button onclick="resetAttribution()" class="w2ui-btn w2ui-btn-red">
                    Reset Scores
                </button>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: ${confidenceColor}20; border-radius: 5px; border-left: 4px solid ${confidenceColor};">
                <strong>Confidence Assessment:</strong>
                ${avgScore >= 7 ? 'Strong evidence supports attribution. Multiple independent indicators align with known actor profile.' :
                  avgScore >= 4 ? 'Moderate evidence present. Some indicators match but additional validation recommended.' :
                  'Weak evidence. Attribution uncertain - more indicators needed or consider alternative actors.'}
            </div>
        </div>
    `;
    
    w2ui.main_layout.content('main', html);
}

/**
 * Update CTI mode field
 */
function updateCTIField(field, value) {
    if (!case_data.cti_mode) {
        case_data.cti_mode = {
            threat_actor: '',
            attribution_score: 0,
            indicators: { ttp_match: 0, tool_match: 0, infrastructure_match: 0, timing_pattern: 0, target_profile: 0 }
        };
    }
    case_data.cti_mode[field] = value;
}

/**
 * Update CTI attribution indicator
 */
function updateCTIIndicator(indicator, value) {
    if (!case_data.cti_mode) {
        case_data.cti_mode = {
            threat_actor: '',
            attribution_score: 0,
            indicators: { ttp_match: 0, tool_match: 0, infrastructure_match: 0, timing_pattern: 0, target_profile: 0 }
        };
    }
    if (!case_data.cti_mode.indicators) {
        case_data.cti_mode.indicators = { ttp_match: 0, tool_match: 0, infrastructure_match: 0, timing_pattern: 0, target_profile: 0 };
    }
    case_data.cti_mode.indicators[indicator] = parseInt(value);
    
    // Update overall score
    const indicators = case_data.cti_mode.indicators;
    case_data.cti_mode.attribution_score = Math.round((
        indicators.ttp_match + indicators.tool_match + indicators.infrastructure_match + 
        indicators.timing_pattern + indicators.target_profile
    ) / 5);
}

/**
 * Suggest attribution based on case data
 */
function suggestAttribution() {
    syncAllChanges();
    
    // Simple heuristic scoring
    const ttps = Object.keys(analyzeMitreAttack()).length;
    const tools = case_data.malware.length;
    const infrastructure = case_data.network.length;
    
    let suggestions = 'Based on your case data:\n\n';
    
    if (ttps > 5) {
        suggestions += `• Strong TTP collection (${ttps} techniques) - consider scoring TTP Match: 7+\n`;
    } else {
        suggestions += `• Limited TTP data (${ttps} techniques) - collect more behavioral indicators\n`;
    }
    
    if (tools > 3) {
        suggestions += `• Multiple tools identified (${tools}) - if they match known actor arsenal, score Tool Match: 6+\n`;
    }
    
    if (infrastructure > 5) {
        suggestions += `• Good infrastructure data (${infrastructure} indicators) - cross-reference with threat intel\n`;
    }
    
    suggestions += '\nReview attribution evidence in timeline and compare against known actor profiles from threat intelligence sources.';
    
    w2alert(suggestions);
}

/**
 * Reset attribution scores
 */
function resetAttribution() {
    w2confirm('Reset all attribution scores to 0?')
        .yes(function() {
            if (!case_data.cti_mode) {
                case_data.cti_mode = { threat_actor: '', attribution_score: 0, indicators: {} };
            }
            case_data.cti_mode.indicators = {
                ttp_match: 0,
                tool_match: 0,
                infrastructure_match: 0,
                timing_pattern: 0,
                target_profile: 0
            };
            case_data.cti_mode.attribution_score = 0;
            showCTIMode();
        });
}
