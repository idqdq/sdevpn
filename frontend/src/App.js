
import React, { Component } from 'react'
import Table from './Table'
import MyModal from './Modal';

const URL = "http://127.0.0.1:8000/getEvpnAll"
class App extends Component {
    state = {
        evpnData: [],        
        isOpen: false,
        areChanges: false,
        isFetching: true,
    }

    async componentDidMount(){
        const response = await fetch(URL);
        const data = await response.json();
        this.setState({ evpnData: data.evpnData, isFetching: false })
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
        const { evpnData } = this.state;

        this.setState({
            evpnData: evpnData.filter((char, i) => {
                return i !== index;
            })
        });
    }

    evpnEdit = index => {
        this.setState({            
            index: index,
        })

        this.openModal();
    }
    
    handleSubmit = (evpn, index) => {
        if (index != null) {
            let newEvpnData = this.state.evpnData.slice();

            newEvpnData[index] = evpn; // replace old evpn data with a new one in the array            
            this.setState({ evpnData: newEvpnData });
        }
        else {
            this.setState({ evpnData: [...this.state.evpnData, evpn] });
        }
        this.hideModal();
    }

    render() {
        const { evpnData, index } = this.state
         
        return (
            <div className="container">
                <Table evpnData={evpnData} evpnRemove={this.evpnRemove} evpnEdit={this.evpnEdit}/>
                <button onClick={this.openModal}>New</button>
                <MyModal evpn={evpnData} index={index} isOpen={this.state.isOpen} hideModal={this.hideModal} handleSubmit={this.handleSubmit}/>                           
            </div>
        )
    }
}

export default App