
import React, { Component } from 'react'
import Table from './Table'
import MyModal from './Modal';

const URL = "http://127.0.0.1:8000/evpn"
class App extends Component {
    state = {
        evpnData: [],        
        changes: {},
        isOpen: false,        
        isFetching: true,
    }

    loaddata = async () => {
        const response = await fetch(URL);
        const data = await response.json();
        this.setState({ evpnData: data, changes: {}, isFetching: false })
    }

    async componentDidMount(){
        await this.loaddata();
    }

    openModal = () => {
        this.setState({
            isOpen: true
        });        
    };

    hideModal = () => {
        this.setState({
            isOpen: false
        });        
        delete this.state.index;
    };

    
    evpnRemove = index => {
        const { evpnData, changes } = this.state;
        
        const newEvpnData = evpnData.filter((char, i) => { 
            return i !== index;
        })

        // if you've just created a new evpn and then delete it, no change happened
        const vlan_id = evpnData[index].vlan_id;
        if (changes[vlan_id]==="new"){
            delete changes[vlan_id];
        }
        else {
            changes[vlan_id] = "del";
        }

        this.setState({ evpnData: newEvpnData, changes: changes })        
    }

    evpnEdit = index => {
        this.setState({            
            index: index,
        })        

        this.openModal();
    }
    
    handleFormSubmit = (evpn, index) => {
        const { changes } = this.state;
        if (index != null) {
            
            const newEvpnData = this.state.evpnData.slice();
            newEvpnData[index] = evpn; // replace old evpn data with a new one in the array
            
            changes[evpn.vlan_id] = "edit";
            this.setState({ evpnData: newEvpnData, changes: changes });
        }
        else {
            changes[evpn.vlan_id] = "new";
            this.setState({ evpnData: [...this.state.evpnData, evpn], changes: changes });
        }
        this.hideModal();
    }

    handleSubmit = () => {
        const { evpnData, changes } = this.state;
        //alert(JSON.stringify(changes, null, 4))

        for (let item in changes) {            
            const index = evpnData.findIndex(x => Number(x.vlan_id)===Number(item));            
            const evpn = evpnData[index];            

            switch (changes[item]) {
                case "del":                    
                    alert(`delete ${item}`)

                    break;
                case "new":
                    alert(`create ${evpn.vlan_id}`)

                    break;
                case "edit":
                    alert(`edit ${evpn.vlan_id}`)

                    break;
                default:
                    console.log("incorrect value changes")
            }
        }
    }

    render() {
        const { evpnData, changes, index, isOpen } = this.state
        const buttonStyle = {
            margin: '0px 5px',
        }

        return (
            <div className="container">
                <Table evpnData={evpnData} changes={changes} evpnRemove={this.evpnRemove} evpnEdit={this.evpnEdit}/>
                <div>
                    <button onClick={this.openModal} style={buttonStyle} type="button" className="btn btn-outline-primary">New</button>
                    <button onClick={this.loaddata} style={buttonStyle} type="button" className="btn btn-outline-secondary">ReLoad</button>
                    <button onClick={this.handleSubmit} disabled={Object.keys(changes).length===0} style={buttonStyle} type="button" className="btn btn-outline-danger">Submit</button>
                </div>
                <MyModal evpn={evpnData} changes={changes} index={index} isOpen={isOpen} hideModal={this.hideModal} handleFormSubmit={this.handleFormSubmit}/>                           
            </div>
        )
    }
}

export default App