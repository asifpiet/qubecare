function isInput  (tag)  {
    if (typeof tag !== 'string') {
        tag = tag.tagName
    }
    return ['input', 'textarea', 'select'].indexOf(tag) !== -1
}
function generateUniqueKey () {
    return 'key_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
};
export default function patchEditor(editor) {
    const Fields = editor.Components.fields.constructor
    if (!Fields.prototype._Component){
    Fields.prototype._Component = Fields.prototype.Component
        Fields.prototype.Component = function (data) {
        console.log(data)
            if (isInput(data.tag) && !data.attrs.name) {
                data={...data,attrs:{...data.attrs,name:generateUniqueKey()}}
                //data.attrs.name = generateUniqueKey()
            }

            const field = this._Component(data)

            // field.updateFieldName()
            return field
        }
    }
}
