window.customElements.define('request-component', class extends HTMLElement {
    connectedCallback() {this.innerHTML = `
        <div style="display: flex">
            <chapter-component text="Request" width="70px"></chapter-component>
            <div>
                <section-start>Request</section-start>
                <div>
                    Method: <span data="method"></span>
                </div>
                <div>
                    Url: <span data="url"></span>
                </div>
                <div style="display: flex">
                    <chapter-component text="Header" width="60px"></chapter-component>
                    <div>
                        <section-start>Headers</section-start>
                        <pre data="headers"></pre>
                    </div>
                </div>
                <div style="display: flex">
                    <chapter-component text="Body" width="45px"></chapter-component>
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
        updateTextContent(this.querySelector('*[data=\'url\']'), props.url);
        updateTextContent(this.querySelector('*[data=\'method\']'), props.method);
        updateTextContent(this.querySelector('*[data=\'headers\']'), JSON.stringify(props.headers, null, 2));
        updateTextContent(this.querySelector('*[data=\'body\']'), props.body);
    }

})
