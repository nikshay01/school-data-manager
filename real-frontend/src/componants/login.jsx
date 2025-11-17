import React from 'react'
import '../App.css'
function login() {
  return (
    <div className='login-body'>
        <div className='login-card'>
          <h1>LOGIN</h1>
            <div className='input-fields'>
              <label htmlFor="USERNAME" className='label'>USERNAME</label>
                      <input type="text" className='input' id='USERNAME' />
                      <input type="text" className='input' />
                      <input type="text" className='input' />
            </div>
        </div>
    </div>
  )
}

export default login