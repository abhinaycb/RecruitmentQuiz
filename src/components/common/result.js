import React from 'react';

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: props.location.state.score,
            totalMarks:props.location.state.totalMarks
        }
    }

    componentWillMount() {

        // firebase.database().ref('Score').on('value', (data) => {
        //     console.log(data.val().S)
        //     this.setState({
        //         score: data.val().S
        //     })
        // })
        
    }
   
    render() {
        return (
            <div>
                    <center>
                        <div>
                            <h1>Quiz Finished</h1>
                            <h1>Your Score {this.state.score} out of {this.state.totalMarks}</h1>
                        </div>
                    </center>
            </div>
        )
    }
}
export default Result;