window.customElements.define('counter-reset', class extends HTMLElement {
    indexRoot = document.createElement('counter-reset-index');
    connectedCallback() {
        this.innerHTML = `
        <div style="display: flex">
            <section-start>Counter reset</section-start>
        </div>
        `;
        document.querySelectorAll("log-index-root").forEach(e => e.add(this.indexRoot));
        this.indexRoot.setDestination(this);
        this.indexRoot.addEventListener("click", () => {
            this.scrollIntoView({behavior: "smooth"})
        })
    }
    update() {}
})

window.customElements.define('counter-reset-index', class extends HTMLElement {
    shadow;

    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = `
        <div active>
            Counter reset
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

    setDestination(node) {
        this.addEventListener("click", () => {
            node.scrollIntoView({behavior: "auto"})
        })
        let observer = new IntersectionObserver((args) => {
            this.setActive(args[0].isIntersecting);
        }, {
            root: document,
            rootMargin: '-10px',
            threshold: [0,
                1,
            ]
        });
        observer.observe(node);
    }

    update(props) {
        updateTextContent(this.shadowRoot.querySelector('*[method]'), props?.request?.method ?? "?");
        updateTextContent(this.shadowRoot.querySelector('*[counter]'), props?.requestHandlerLogger?.counter ?? "?");
        updateTextContent(this.shadowRoot.querySelector('*[url]'), props?.request?.url ?? "?");
    }
})