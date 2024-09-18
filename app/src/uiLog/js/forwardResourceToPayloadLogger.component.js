window.customElements.define('forward-resource-to-payload-logger', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div style="padding-left: 30px">
            <div data="_type"></div>
            <request-component data="request"></request-component>
            <response-component data="response"></response-component>
        </div>
        `;
    }

    update(props) {
        updateTextContent(this.querySelector('*[data=\'_type\']'), props._type);
        this.querySelector('*[data=\'request\']').update(props.request);
        this.querySelector('*[data=\'response\']').update(props.response);
    }

})
