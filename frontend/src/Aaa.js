import React, { Component } from 'react'

const Lines = (props) => {
    const elements = props.elements.map((el, index) => {
        return (
            <div key={index} className="inline-block button" onClick={() => props.handle(index)}>{el}</div>
        )
    })
    return <div className="block">{elements}</div>
}

class Aaa extends Component {
    
    state = { 
        el1: ['С','Ч','А','С','Т','Ь','Е',],
        el2: ['Ж','О','П','А'],
    }


    el1Action = index => {
        const { el1, el2 } = this.state;            

        this.setState({
            el1: el1.filter((char, i) => {
                return i !== index;
            })
        });

        this.setState({
            el2: [...el2, el1[index]]
        });
    }

    el2Action = index => {
        const { el1, el2 } = this.state;

        this.setState({
            el2: el2.filter((char, i) => {
                return i !== index;
            })
        });

        this.setState({
            el1: [...el1, el2[index]]
        });
    }


    render() {
        const { el1, el2 } = this.state

        return (
            <div>
                <Lines elements={el1} handle={this.el1Action}/>
                <Lines elements={el2} handle={this.el2Action}/>
            </div>
        )
    }
}

export default Aaa