
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
    }

    hideModal = () => {
        this.setState({
            isOpen: false
        });        
        delete this.state.index;
    }

    restPostData = async (evpn) => {
        try {
            const res = await fetch(`${URL}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",                    
                },
                body: JSON.stringify(evpn),
            });

            if (!res.ok) {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }

            const data = await res.json();

            const result = {
                status: res.status + "-" + res.statusText,
                headers: {
                    "Content-Type": res.headers.get("Content-Type"),
                    "Content-Length": res.headers.get("Content-Length"),
                },
                data: data,
            };

            alert(JSON.stringify(result, null, 4));
        } catch (err) {
            alert(err.message);
        }
    }


    restPutData = async (item, evpn) => {

    }

    restDeleteData = async (vni) => {
        if (vni) {
            try {
                const response = await fetch(`${URL}/${vni}`, { method: "delete" });
                const data = await response.json();

                const result = {
                    status: response.status + "-" + response.statusText,
                    headers: { "Content-Type": response.headers.get("Content-Type") },
                    data: data,
                };

                alert(JSON.stringify(result, null, 4));
            } catch (err) {
                alert(err);
            }
        }
    }

    evpnRemove = index => {
        const { evpnData, changes } = this.state;
        
        const newEvpnData = evpnData.filter((char, i) => { 
            return i !== index;
        })

        // if you've just created a new evpn and then delete it, no change happened
        const vni = evpnData[index].vni;
        if (changes[vni]==="new"){
            delete changes[vni];
        }
        else {
            changes[vni] = "del";
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
            
            changes[evpn.vni] = "edit";
            this.setState({ evpnData: newEvpnData, changes: changes });
        }
        else {
            changes[evpn.vni] = "new";
            this.setState({ evpnData: [...this.state.evpnData, evpn], changes: changes });
        }
        this.hideModal();
    }

    handleSubmit = () => {
        const { evpnData, changes } = this.state;        

        for (let item in changes) {            
            const index = evpnData.findIndex(x => Number(x.vni)===Number(item));            
            const evpn = evpnData[index];            

            switch (changes[item]) {
                case "del":                    
                    alert(`delete ${item}`);
                    this.restDeleteData(item); 
                    break;

                case "new":
                    alert(`create ${evpn.vni}`)
                    this.restPostData(evpn); 
                    break;

                case "edit":
                    alert(`edit ${evpn.vni}`)
                    this.restPutData(item, evpn)
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