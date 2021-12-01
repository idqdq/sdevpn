import React, { Component } from 'react'

const INTKEYS = ['vlan_id', 'vni', 'mtu'];
const IPADDRESSKEYS = ['svi_ip', 'mgroup'];

class Form extends Component {
       
    initialState = {
        evpn: {
            vlan_id: 0,
            vni: 0,
            vlan_name: '',
            svi_ip: '',
            svi_descr: '',
            mtu: 1500,
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
        const evpn = Object.assign({}, this.state.evpn);
        
        for (let key of INTKEYS) {
            evpn[key] = Number(evpn[key]);
        }

        for (let key of IPADDRESSKEYS) {
            if (!evpn[key]) evpn[key] = null;
        }

        this.props.handleSubmit(evpn, this.index);
        this.setState(this.initialState)        
    }

    validateField(name, value){        
        const errors = {};                
        const cidrIpAddrPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(3[0-2]|[1-2][0-9]|[0-9])$)/;
        const mcastIpAddrPattern = /^(22[4-9]|23[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (INTKEYS.indexOf(name) > -1){
            value = Number(value);            
        }

        switch(name) {
            case 'vlan_id':                
                if (this.index!==undefined && this.props.evpn[this.index].vlan_id===value) 
                    break;  //old value
                if(!(!isNaN(value) && value > 1 && value < 4096)) {
                    errors[name] = 'should be a number from 2 to 4096';                    
                }
                else if ((this.props.evpn.find(x => value===x.vlan_id)) || (this.props.changes.hasOwnProperty(value))){
                    errors[name] = 'vlan_id ' + value + ' already exist'; 
                }
                break;

            case 'vni':                 
                if (this.index!==undefined && this.props.evpn[this.index].vni===value) 
                    break;  //old value
                if(!(!isNaN(value) && value >= 10000 && value <= 10999)) {
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
                <div className="mb-3 row">                
                <label htmlFor="vlan" className="col-sm-2 col-form-label">vlan</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="number"
                            name="vlan_id"
                            id="vlan_id"
                            disabled={this.index}
                            value={vlan_id || ''}
                            placeholder="10"
                            onChange={this.handleChange}
                            onBlur = {this.handleBlur} />
                            <span style={{display: "block"}}><small className="form-text text-muted"><i>regular vlan number (range 1-4096)</i></small></span>
                            <span style={{color: "red"}}>{this.state.errors["vlan_id"]}</span>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="vni" className="col-sm-2 col-form-label">vni</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="number"
                            name="vni"
                            id="vni"
                            disabled={this.index}
                            value={vni || ''}
                            placeholder="10010"
                            onChange={this.handleChange}
                            onBlur = {this.handleBlur} />
                            <span style={{display: "block"}}><small className="form-text text-muted"><i>vxlan identifier (range 10000-10999)</i></small></span>  
                            <span style={{color: "red"}}>{this.state.errors["vni"]}</span>
                    </div>
                </div>        
                <div className="mb-3 row">                   
                    <label htmlFor="vlan_name" className="col-sm-2 col-form-label">vlan_name</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="vlan_name"
                            id="vlan_name"
                            value={vlan_name || ''}
                            placeholder="vlan10"
                            onChange={this.handleChange}
                            onBlur = {this.handleBlur} />
                            <span style={{display: "block"}}><small className="form-text text-muted"><i>vlan name (optional)</i></small></span>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="svi_ip" className="col-sm-2 col-form-label">svi_ip</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="svi_ip"
                            id="svi_ip"
                            value={svi_ip || ''}
                            placeholder="10.1.10.254/24"
                            onChange={this.handleChange}
                            onBlur = {this.handleBlur} />
                            <span style={{display: "block"}}><small className="form-text text-muted"><i>IPv4 address in CIDR format e.g. a.b.c.d/x (optional)</i></small></span>
                            <span style={{color: "red"}}>{this.state.errors["svi_ip"]}</span>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="svi_descr" className="col-sm-2 col-form-label">svi_descr</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="svi_descr"
                            id="svi_descr"
                            value={svi_descr || ''}
                            placeholder="svi10"
                            onChange={this.handleChange}
                            onBlur = {this.handleBlur} />
                            <span style={{display: "block"}}><small className="form-text text-muted"><i>svi interface description (optional)</i></small></span>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="mtu" className="col-sm-2 col-form-label">mtu</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="number"
                            name="mtu"
                            id="mtu"
                            value={mtu || 1500}
                            placeholder="1500"
                            onChange={this.handleChange}
                            onBlur = {this.handleBlur} />
                            <span style={{display: "block"}}><small className="form-text text-muted"><i>default 1500</i></small></span>
                            <span style={{color: "red"}}>{this.state.errors["mtu"]}</span>
                    </div>
                </div>
                <div className="mb-3 row">
                <label htmlFor="vrf" className="col-sm-2 col-form-label">vrf</label>
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="vrf"
                            id="vrf"
                            value={vrf || ''}
                            placeholder="Tenant-1"
                            onChange={this.handleChange}
                            onBlur={this.handleBlur} />
                        <span style={{ display: "block" }}><small className="form-text text-muted"><i>default Tenant-1</i></small></span>
                    </div>
                </div>
                <div className="mb-3 row">
                <label htmlFor="mgroup" className="col-sm-2 col-form-label">mgroup</label>  
                    <div className="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="mgroup"
                            id="mgroup"
                            value={mgroup || ''}
                            placeholder="239.0.0.10"
                            onChange={this.handleChange}
                            onBlur={this.handleBlur} />
                        <span style={{ display: "block" }}><small className="form-text text-muted"><i>multicast group (optional)</i></small></span>
                        <span style={{ color: "red" }}>{this.state.errors["mgroup"]}</span>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="arpsup" className="col-sm-2 col-form-label">Arp suppression</label>
                    <div className="col-sm-5 mt-2">                        
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="arpsup"
                                id="arpsup"
                                checked={arpsup}
                                onChange={this.handleClickArpSup} />                        
                    </div>
                </div>
                <input type="button" value="Submit" onClick={this.submitForm} disabled={!this.state.formValid} className="btn btn-outline-success" />                
            </form>            
        );
    }
}

export default Form;