(function () {
 
    /**
     * Created a bootstrap time control
     * @attribute {string} [label] - The label for the control
     * @attribute {boolean} [mandatory] - Whether the field is mandatory
     * @event change - Fired when the time changes
     * @event dummy - This event will never fire
     */
    customElements.define("time-picker", class TimePicker extends HTMLElement {

        constructor(self) {
            self = super(self);
          	self._initialized = false;
            self._buildElements();
            self._debouncer = null;
            return self;
        }

        static get observedAttributes() {
            return ["label", "mandatory"];
        }
      
        connectedCallback() {
			this._initialized = true;
            this._render();
            this._fireChange();
        }

        _buildElements() {

            this.idPrefix = `el_${new Date().getTime()}`;

            this.txtTime = document.createElement("input");
          	this.txtTime.setAttribute("id", "txtTime");
            this.txtTime.setAttribute("type", "text");
          	this.txtTime.addEventListener("blur", _ => { this._fireChange() });
          
          	this.requiredStyle = (this.attributes["mandatory"] && this.attributes["mandatory"].value) ? "" : "display:none!important;";
        }

        _render() {
            let html = `
                <div class="field time">
				  <label class="control-label">${this.attributes["label"].value}</label>
				  <span class="required-asterix fa fa-star ng-scope" style="${this.requiredStyle}"></span>
                  <div class="input-group date" id="${this.idPrefix}_datetimepicker">
                  <div class="inject"></div>
                  <span class="input-group-addon">
                  	<span class="fa fa-clock-o"></span>
                  </span>
                  </div>
                </div>
            `;

            var el = document.createElement("div");
            el.innerHTML = html;

            el.querySelector(".field.time .inject").appendChild(this.txtTime);
            this.innerHTML = "";
            this.appendChild(el);
          
          	//add datepicker
          	$('#'+this.idPrefix+'_datetimepicker').datetimepicker({
              format: 'LT'
            });
          
          	console.log(this.txtTime.value);
        }

        _fireChange() {
            this.requiredStyle = (this.attributes["mandatory"] && this.attributes["mandatory"].value && this.txtTime.value == "") ? "" : "display:none!important;";
          	this._render();
          
            if (this._debouncer) clearTimeout(this._debouncer);
            this._debouncer = setTimeout(_ => {
                this.dispatchEvent(new CustomEvent("change"));
            }, 100);
        }

        /**
         * Get the time
         * @model
         * @returns {string}
         */
        get time() {
            return this.txtTime.value;
        }
        /**
         * Set the time
         * @param {string} val
         */
        set time(val) {
            this.txtTime.value = val || "";
          	let targetStyle = (this.attributes["mandatory"] && this.attributes["mandatory"].value && this.txtTime.value == "") ? "" : "display:none!important;";

          	if (targetStyle != this.requiredStyle) {
           		this.requiredStyle = targetStyle;
              	this._render();
            }
        }

    });

})();