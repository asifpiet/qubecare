function isInput(tag) {
    if (typeof tag !== 'string') {
        tag = tag.tagName
    }
    return ['input', 'textarea', 'select', 'signature-pad', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'multiselect', 'drag-drop-file'].indexOf(tag) !== -1
}
function generateUniqueKey() {
    return 'key_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
};
export default function patchEditor(editor) {
    const Fields = editor.Components.fields.constructor
    if (!Fields.prototype._Component) {
        Fields.prototype._Component = Fields.prototype.Component
        Fields.prototype.Component = function (data) {
            console.log(data)
            if (isInput(data.tag) && !data.attrs.name) {
                data = { ...data, attrs: { ...data.attrs, name: generateUniqueKey() } }
                if (data.tag == 'signature-pad') {
                    data.attrs.name = 'signature_' + data.attrs.name
                }


                if (data.attrs?.type == 'radio' || data.attrs?.type == 'checkbox') {
                    //data.attrs.id = data.attrs.name
                    console.log(data)
                    data.attrs.name = 'f-' + data.id
                }
                //data.attrs.name = generateUniqueKey()
            }

            const field = this._Component(data)

            // field.updateFieldName()
            return field
        }
    }
}
