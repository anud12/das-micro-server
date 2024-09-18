window.customElements.define('http-request-handler-logger', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div style="display: flex">
            <chapter-component text="Http request handler" width="190px"></chapter-component>
            <div>
                <section-start>Http request handler</section-start>
                <div>
                    Path: <span data="path"></span>
                </div>
                <div>
                    Counter: <span data="counter"></span>
                </div>
                <div>
                    Resource Path: <span data="resourcePath"></span>
                </div>
                <div data="resourceToPayload"></div>
            </div>
        </div>
        `;
    }
    update(props) {
        // updateTextContent(this.querySelector('*[data=\'_type\']'), props._type);
        updateTextContent(this.querySelector('*[data=\'path\']'), props.path);
        updateTextContent(this.querySelector('*[data=\'counter\']'), props.counter);
        updateTextContent(this.querySelector('*[data=\'resourcePath\']'), props.resourcePath);

        const resourceToPayload = props.resourceToPayload ?? {};
        const nodeTag = resourceToPayload?._type?.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        if(!nodeTag) {
            return;
        }
        let node =  this.querySelector(nodeTag)
        if(!node) {
            node = document.createElement(nodeTag);
            this.querySelector('*[data=\'resourceToPayload\']').appendChild(node)
        }
        node.update(resourceToPayload)
    }

})
