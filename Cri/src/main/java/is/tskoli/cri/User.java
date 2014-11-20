/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.util.*;
/**
 *
 * @author alexander
 */
public class User extends Database{
    
    public String username;
    public String password;
    
    public Map<String, String> data = new HashMap<String, String>();
    
    public User(String username, String password) throws Exception{
        //connect to database
        super.connect();
        this.username = username;
        this.password = password;
    }
    
    public Boolean login() throws Exception{
        if(super.login(this)){
            //if login worked, load new data
            this.data = super.userData(this);
            return true;
        }
        return false;
    }
}
