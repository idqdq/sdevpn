
import React, { Component } from 'react'
import Table from './Table'
import MyModal from './Modal';

const URL = "http://127.0.0.1:8000/evpn"
class App extends Component {
    state = {
        evpnData: [],        
        isOpen: false,
        areChanges: false,
        isFetching: true,
    }

    loaddata = async () => {
        const response = await fetch(URL);
        const data = await response.json();
        this.setState({ evpnData: data, isFetching: false })
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
        const buttonStyle = {
            margin: '0px 5px',
        }

        return (
            <div className="container">
                <Table evpnData={evpnData} evpnRemove={this.evpnRemove} evpnEdit={this.evpnEdit}/>
                <div>
                    <button onClick={this.openModal} style={buttonStyle}>New</button>
                    <button onClick={this.loaddata} style={buttonStyle} className="btn-secondary">ReLoad</button>
                    <button onClick={this.openModal} style={buttonStyle} className="btn-danger">Submit</button>
                </div>
                <MyModal evpn={evpnData} index={index} isOpen={this.state.isOpen} hideModal={this.hideModal} handleSubmit={this.handleSubmit}/>                           
            </div>
        )
    }
}

export default App