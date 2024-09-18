window.customElements.define('chapter-component', class extends HTMLElement {
    static get observedAttributes() { return ['text', 'width']; }
    textStyle = () => `
        white-space: nowrap;
        display: block;
        width: ${this.getAttribute("width")};
        transform: rotateZ(-90deg);
        transform-origin: top left;
        margin-top: ${this.getAttribute("width")};
        margin-bottom: 2px;
    `
    connectedCallback() {
        this.setAttribute("style", `
        position: sticky;
        top:0; 
        margin-left: 0px;
        min-height: 0px;
        min-width: 20px; 
        max-width: 20px;
        border: solid lightgray;
        border-width: 1px 1px 1px 0px;
        font-family: monospace;
        font-size: 16px;
        background-color: white;
        `)
        this.innerHTML = `
                <div style="position: sticky;  top: 0;">
                    <button start style="
                    text-align: center;
                    height: 35px;
                    min-width: 20px; 
                    max-width: 20px;
                    padding: 0 2px;
                    display: block;
                    border:none;
                    ">
                        &#8630;
                    </button>
                    <button previous  style="
                    text-align: center;
                    height: 35px;
                    min-width: 20px; 
                    max-width: 20px;
                    padding: 0 2px; 
                    display: block;
                    border:none;
                    ">
                        &#10514;
                    </button>
                    <button end style="
                    position: sticky;
                    bottom: 0;
                    text-align: center;
                    height: 35px;
                    min-width: 20px;
                    padding: 0 2px; 
                    max-width: 20px;
                    display: block; 
                    border:none;
                    ">
                        &#10515;
                    </button>
                    <div text style="${this.textStyle()}">${this.getAttribute("text") ?? ""}</div>
                </div>
                
        `;
        this.querySelector("*[previous]").addEventListener("click", (e) => {
            if(this.parentElement.getBoundingClientRect().top < 1) {
                // scroll to get upper element
                window.scrollTo({
                    top: this.parentElement.getBoundingClientRect().top + window.pageYOffset - 1
                })
            }
            const parentRectangle = this.parentElement.getBoundingClientRect();
            const args = [parentRectangle.left, parentRectangle.top - 1]
            const previousElement = document.elementFromPoint(...args);
            previousElement.scrollIntoView({behavior:"smooth"})
        })
        this.querySelector("*[start]").addEventListener("click", () => {window.scrollTo({
            top: this.parentElement.getBoundingClientRect().top + window.pageYOffset,
            behavior:"smooth"
        })
        })
        this.querySelector("*[end]").addEventListener("click", () => {
            window.scrollTo({
                top: this.parentElement.getBoundingClientRect().bottom + window.pageYOffset,
                behavior:"smooth"
            })
            // this.parentElement.scrollIntoView({behavior:"smooth", block:"end", inline:"end"});
        })
    }
    attributeChangedCallback() {
        const element = this.querySelector("*[text]");
        if(element) {
            element.setAttribute("style", this.textStyle());
            element.innerHTML = this.getAttribute("text");
        }
    }

})
