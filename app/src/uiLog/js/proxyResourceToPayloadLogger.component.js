window.customElements.define('proxy-resource-to-payload-logger', class extends HTMLElement {
    connectedCallback() {this.innerHTML = `
        <div style="display: flex">
            <chapter-component text="Proxy resource to payload" width="225px"></chapter-component>
             
            <div>
                <section-start>Proxy resource to payload</section-start>
                <request-component data="request"></request-component>
                <response-component data="response"></response-component>
            </div>
            
        </div>
        `;
    }

    update(props) {
        this.querySelector('*[data=\'request\']').update(props.request);
        this.querySelector('*[data=\'response\']').update(props.response);
    }

})
