/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;

/**
 *
 * @author alexander
 */
public class User {
    
    public User(){
    
    }
    public Boolean login(String username, String password){
        
        if(username.equals("ayy") && password.equals("lmao")){
            return true;
        }  
        return false;
    }
}
