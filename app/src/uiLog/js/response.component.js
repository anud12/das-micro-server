window.customElements.define('response-component', class extends HTMLElement {
    connectedCallback() {this.innerHTML = `
        <div style="display: flex">
            <chapter-component text="Response" width="75px"></chapter-component>
            <div>
                <section-start>Response</section-start>
                <div>
                    Status: <span data="status"></span>
                </div>
                <div>
                    Message: <span data="statusMessage"></span>
                </div>
                <div style="display: flex">
                    <chapter-component text="Body" width="40px"></chapter-component>
                    <div>
                        <section-start>Body</section-start>
                        <pre data="body"></pre>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    update(props) {
        updateTextContent(this.querySelector('*[data=\'status\']'), props?.status);
        updateTextContent(this.querySelector('*[data=\'statusMessage\']'), props?.statusMessage);
        updateTextContent(this.querySelector('*[data=\'body\']'), props?.body);
    }

})