window.customElements.define('log-index-root', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div container>
            <div>Http server handler</div>
        </div>
        `;
    }

    add = (node) => {
        this.appendChild(node);
    }
})
