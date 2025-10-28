
let import_lines = [];
let import_fieldset = [];
let import_grid = null;
let firstline = [];  //needed for import mapping


function show_import_dialog(grid){

    // open file
    const {remote} = require('electron')
    const {dialog} = remote
    const path = dialog.showOpenDialog({filters:[{name:"CSV File"}]});

    if(path == undefined) return;

    const fs = require('node:fs');

    w2utils.lock($( "#main" ),"Loading File...",true)

    let filebuffer = fs.readFileSync(path.toString());

    let fieldset = []
    import_fieldset = []
    import_grid = grid

    for(const column of grid.columns){
        if(column.caption=="Date added") continue; // don't show date added
        fieldset.push(column.caption)
        import_fieldset.push(column.field)
    }

    filebuffer= filebuffer.toString()
    import_lines = filebuffer.split(/(?:\r\n|\n)+/)
    w2utils.unlock($( "#main" ))
    openImportPopup(fieldset,import_lines,import_fieldset)

}

function import_data() {
    if (import_lines.length < 1) {
        alert("Could not import. Empty file.")
        w2popup.close()
        return
    }
    w2ui.grd_import_mapping.save()
    w2utils.lock($( "#main" ),"Parsing data...",true)

    let mappings=[]
    for(const rcd of w2ui.grd_import_mapping.records){
        if(rcd.csv == "") continue
        let mapping = {field:rcd.fieldname,column:firstline.indexOf(rcd.csv)}
        mappings.push(mapping)
    }

    //when adding only add existing fields. so in the add loop rather than going through the input data go through the mapping data and add only what's in there

    //build import data
    for(const line of import_lines){
        let fields = CSVtoArrayEasy(line)
        let import_object = {}
        if(!fields) continue
        import_object["recid"]=getNextRECID(import_grid)
        import_object["date_added"] = Date.now()

        for(const mapping of mappings){
            import_object[mapping.field]=fields[mapping.column]
        }
        import_grid.add(import_object)

    }


    import_grid.refresh()
    w2utils.unlock($( "#main" ))
    w2popup.close()
}