window.customElements.define('http-resource-to-payload-logger', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div style="display: flex">
            <chapter-component text="Http resource to payload" width="175px"></chapter-component>
            <div data="_type"></div>
        </div>
        `;
    }

    update(props) {
        updateTextContent(this.querySelector('*[data=\'_type\']'), props._type);
    }

})
