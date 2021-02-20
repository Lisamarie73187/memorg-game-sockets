import React, {useEffect, useMemo} from 'react'



function Modal({closeModal, user, modals, newGame}) {

    useEffect(() => {
        setTimeout(() => {
            closeModal(false)
        }, 3000)
    }, []);



    const renderText = () => {
        if(modals.nextPlayer){
            return (
                <div className="modalWrapper">
                    <div className='modalText'>It's</div>
                    <div style={{color: user.color, fontSize: '40px'}}>{user.name}</div>
                    <div className='modalText'>Turn</div>
                </div>
            )
        } else if (modals.match){
            return (
                <div>
                    <div className='modalText'>It's</div>
                    <div className='modalText'>a</div>
                    <div className='modalText'>Match</div>
                    <div className='modalText' style={{paddingTop: '20px'}}>Go Again</div>
                </div>
            )
        }  else if (modals.gameOver){
            return (
                <div>
                    <div className='gameOver'>Game Over</div>
                    <div onClick={newGame}>Play Again?</div>
                </div>
            )
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modal">
                <div style={
                    {
                        backgroundColor: `${user.color}`,
                        height: '20px',
                        marginBottom: '10px'
                    }
                }/>
                {renderText()}
            </div>

        </div>
    );
}

export default Modal;
