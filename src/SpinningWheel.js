import React from 'react';

function SpinningWheel(props){
	if(props.show)
		return <div class="lds-ring" style={props.style}><div></div><div></div><div></div><div></div></div>;
	else
		return null;
}

export default SpinningWheel;
