window.customElements.define('create-http-server-logger', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div>
<!--            <div data="_type"></div>-->
            <div data="root"></div>
            <div data="port"></div>
            <div data="counterResetTimer"></div>
            <div data="children"></div>
        </div>
        `;
    }

    update(props) {
        // updateTextContent(this.querySelector("*[data='_type']"), props._type);
        updateTextContent(this.querySelector("*[data='root']"), props.root)
        updateTextContent(this.querySelector("*[data='port']"), props.port)
        updateTextContent(this.querySelector("*[data='counterResetTimer']"), props.counterResetTimer)
        const childrenData = props.children;
        childrenData?.forEach((element, index) => {
            const tag = element._type.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            const childrenNode = this.querySelector("*[data='children']");
            const childrenNodeList = childrenNode.children;
            let node = childrenNodeList[index];
            if (!node) {
                node = document.createElement(tag);
                childrenNode.appendChild(node);
            }
            node = updateNodeTag(tag, node, childrenNode);
            node.update(element);
        })
    }

})
