import React, { Component } from 'react'

class Form extends Component {
       
    initialState = {
        evpn: {
            vlan_id: '',
            vni: '',
            vlan_name: '',
            svi_ip: '',
            svi_descr: '',
            mtu: '',
            vrf: '',
            mgroup: '',
            arpsup: false,
        },
        errors: {},
        formValid: false,
    }

    index = this.props.index;        
    state = this.initialState;    

    constructor(props){
        super(props);        
        if (this.index!==undefined) {
            this.state.evpn = this.props.evpn[this.index];
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target

        this.setState({ 
            evpn: { ...this.state.evpn, [name]: value }
        })
    }

    handleClickArpSup = () => { 
        this.setState( prevState => ({  
            evpn: { ...this.state.evpn, arpsup: !prevState.evpn.arpsup }
        }));
        this.isFormValid(); 
    }

    handleBlur = (event) => {
        const { name, value } = event.target
        
        this.validateField(name, value);
        this.isFormValid();        
    }

    isFormValid = () => {
        if (Object.keys(this.state.errors).length === 0) {
            if (this.state.evpn.vlan_id && this.state.evpn.vni) this.setState({ formValid: true });
        }
    }

    submitForm = () => {        
        this.props.handleSubmit(this.state.evpn, this.index);
        this.setState(this.initialState)        
    }

    validateField(name, value){        
        const errors = {};                
        const cidrIpAddrPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(3[0-2]|[1-2][0-9]|[0-9])$)/;
        const mcastIpAddrPattern = /^(22[4-9]|23[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        switch(name) {
            case 'vlan_id':                
                if (this.index!==undefined && this.props.evpn[this.index].vlan_id===value) 
                    break;  //old value
                if(!(!isNaN(value) && value > 1 && value < 4096)) {
                    errors[name] = 'should be a number from 2 to 4096';                    
                }
                else if (this.props.evpn.find(x => value===x.vlan_id)){
                    errors[name] = 'vlan_id ' + value + ' already exist'; 
                }
                break;

            case 'vni':
                if (this.index!==undefined && this.props.evpn[this.index].vni===value) 
                    break;  //old value
                if(!(!isNaN(value) && value > 10000 && value < 10999)) {
                    errors[name] = 'should be a number from 10000 to 10999';                    
                }
                else if (this.props.evpn.find(x => value===x.vni)){
                    errors[name] = 'vni ' + value + ' already exist'; 
                }
                break;
            case 'vlan_name':
                break;
            case 'svi_ip':
                if (value && !cidrIpAddrPattern.test(value)) {
                    errors[name] = 'must be a valid IP address with mask in CIDR notation e.g. 10.1.2.3/31'
                }
                break;
            case 'svi_descr':
                break;
            case 'mtu':                                
                if(!(!isNaN(value) && value >=1280 && value <= 9216)) {
                    errors[name] = 'should be a number from 1280 to 9216';                    
                }          
                break;
            case 'vrf':
                break;
            case 'mgroup':
                if (value && !mcastIpAddrPattern.test(value)) {
                    errors[name] = 'must be a valid mcast IP address (range 224.0.0.0 - 239.255.255.255)'
                }
                break;
            default:
                break;
        }
        
        if (Object.keys(errors).length) {
            this.setState({ errors: {...this.state.errors, ...errors }});
            this.setState({ formValid: false });
        } else {
            if (this.state.errors[name]) {
                let newerrors = { ...this.state.errors };
                delete newerrors[name];
                this.setState({ errors: newerrors });
            }
        }
    }

    render() {
        const { vlan_id, vni, vlan_name, svi_ip, svi_descr, mtu, vrf, mgroup, arpsup } = this.state.evpn;

        return (            
            <form>                
                <label htmlFor="vlan">vni</label>
                <input
                    type="number"
                    name="vlan_id"
                    id="vlan_id"
                    value={vlan_id}
                    placeholder="10"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><i>regular vlan number (range 1-4096)</i></small></span>
                    <span style={{color: "red"}}>{this.state.errors["vlan_id"]}</span>
                <label htmlFor="vni">vni</label>
                <input
                    type="number"
                    name="vni"
                    id="vni"
                    value={vni}
                    placeholder="10010"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><i>vxlan identifier (range 10000-10999)</i></small></span>  
                    <span style={{color: "red"}}>{this.state.errors["vni"]}</span>                            
                <label htmlFor="vlan_name">vlan_name</label>
                <input
                    type="text"
                    name="vlan_name"
                    id="vlan_name"
                    value={vlan_name}
                    placeholder="vlan10"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><b>optional</b></small></span>
                <label htmlFor="svi_ip">svi_ip</label>
                <input
                    type="text"
                    name="svi_ip"
                    id="svi_ip"
                    value={svi_ip}
                    placeholder="10.1.10.254/24"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><b>optional:</b> <i>IPv4 address in CIDR format e.g. a.b.c.d/x</i></small></span>
                    <span style={{color: "red"}}>{this.state.errors["svi_ip"]}</span>
                <label htmlFor="svi_descr">svi_descr</label>
                <input
                    type="text"
                    name="svi_descr"
                    id="svi_descr"
                    value={svi_descr}
                    placeholder="svi10"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><b>optional</b></small></span>
                <label htmlFor="mtu">mtu</label>
                <input
                    type="number"
                    name="mtu"
                    id="mtu"
                    value={mtu}
                    placeholder="1500"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><b>optional:</b> <i>default 1500</i></small></span>
                    <span style={{color: "red"}}>{this.state.errors["mtu"]}</span>
                <label htmlFor="vrf">vrf</label>
                <input
                    type="text"
                    name="vrf"
                    id="vrf"
                    value={vrf}
                    placeholder="Tenant-1"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><b>optional:</b> <i>default Tenant-1</i></small></span>
                <label htmlFor="mgroup">mgroup</label>                
                <input
                    type="text"
                    name="mgroup"
                    id="mgroup"
                    value={mgroup}
                    placeholder="231.0.0.10"
                    onChange={this.handleChange}
                    onBlur = {this.handleBlur} />
                    <span style={{display: "block"}}><small className="form-text text-muted"><b>optional</b></small></span>
                    <span style={{color: "red"}}>{this.state.errors["mgroup"]}</span>
                <label htmlFor="arpsup">Arp suppression</label>
                <input type="checkbox"
                    name="arpsup"
                    id="arpsup"
                    checked={arpsup}
                    onChange={this.handleClickArpSup}/>        
                <div></div>
                <input type="button" value="Submit" onClick={this.submitForm} disabled={!this.state.formValid} />                
            </form>            
        );
    }
}

export default Form;