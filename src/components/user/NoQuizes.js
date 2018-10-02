import React from 'react';
//NO QUIZ AVAILABLE

class NoQuizes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            don: [],
            count: 0,
        }
    }

    render() {
        return (
            <div>
                    <center>
                        <div>
                            <h1>Quiz Not; Available For This Time!</h1>
                        </div>
                    </center>
            </div>
        )
    }
}
export default NoQuizes;