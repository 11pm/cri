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
    
    public Map<String, String> data = new HashMap<>();
    
    //public List<Friend> friends = new ArrayList<>();
    public String f;
    
    public User(String username, String password){
        try{
            //connect to database
            super.connect();
            this.username = username;
            this.password = password;
        }
        catch(Exception e){
            e.getStackTrace();
        }
    }
    
    public Boolean login() throws Exception{
        if(super.login(this)){
            //if login worked, load new data
            this.data = super.userData(this);
            this.f = super.userFriends(this);
            return true;
        }
        return false;
    }
    
}