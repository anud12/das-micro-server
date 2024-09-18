window.customElements.define('graphql-request-handler-logger', class extends HTMLElement {
    legend = document.createElement("graphql-request-handler-logger-legend");
    connectedCallback() {
        this.innerHTML = `
        <div style="display: flex; flex-shrink: 1">
            <chapter-component text="Graphql Request Handler" width="210px"></chapter-component>
            <div>
                <div>
                    <section-start>Graphql Request Handler</section-start>
                    <div>
                        Operation Name: <span data="operationName"></span>
                    </div>
                    <div>
                        Counter: <span data="counter"></span>
                    </div>
                    <div>
                        Module Root: <span data="moduleRoot"></span>
                    </div>
                    <div>
                        Resource: <span data="resource"></span>
                    </div>
                    <div style="display: flex">
                            <chapter-component text="Query" width="50px"></chapter-component>
                        <div>
                            <section-start>Query</section-start><pre data="query"></pre>
                        </div>
                    </div>
                    <div style="display: flex">
                        <chapter-component text="Variables" width="85px"></chapter-component>
                        <div>
                            <section-start>Variables</section-start><pre data="variables"></pre>
                        </div>
                    </div>
                    <div data="resourceToPayload"></div>
                    <div>
                        Error: <span data="error"></span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    update(props) {
        // updateTextContent(this.querySelector('*[data=\'_type\']'), props._type);
        updateTextContent(this.querySelector('*[data=\'operationName\']'), props.operationName);
        updateTextContent(this.querySelector('*[data=\'counter\']'), props.counter);
        updateTextContent(this.querySelector('*[data=\'moduleRoot\']'), props.moduleRoot);
        updateTextContent(this.querySelector('*[data=\'resource\']'), props.resource);
        updateTextContent(this.querySelector('*[data=\'variables\']'), JSON.stringify(props.variables, null, 2))
        updateTextContent(this.querySelector('*[data=\'query\']'), props.query);
        updateTextContent(this.querySelector('*[data=\'error\']'), props.error);
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
        node.update(resourceToPayload);
        this.legend.update(props);
    }

})


window.customElements.define('graphql-request-handler-logger-legend', class extends HTMLElement {
    shadow;
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
        <div active>
            Hello world
        </div>
        <style>
            *[active] {
                user-select: none;
                cursor: pointer;
                padding: 5px 0px 5px 10px;
                transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
                font-size: 12px;
                background-color: white;
                color: black;
                font-family: sans-serif;
            }
            *[active]:hover {
                background-color: gray;
                color: white;
            }
            *[active=true] {
                background-color: lightgray;
                color: black;
            }
        </style>
        `;
        this.shadow = shadow;
    }
    setActive(bool) {
        this.shadowRoot.querySelector("*[active]").setAttribute("active", bool);
    }
    update(props) {
        // updateTextContent(this.shadowRoot.querySelector('*[method]'), props?.request?.method ?? "?");
        // updateTextContent(this.shadowRoot.querySelector('*[counter]'), props?.requestHandlerLogger?.counter ?? "?");
        // updateTextContent(this.shadowRoot.querySelector('*[url]'), props?.request?.url ?? "?");
    }
})