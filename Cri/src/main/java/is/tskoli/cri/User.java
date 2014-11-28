/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;
/**
 *
 * @author alexander
 */
public class User extends Database{
    
    public String username;
    public String password;
    public Session sesh;
    
    public Map<String, String> data = new HashMap<>();
    
    public List<Map<String, String>> friends = new ArrayList<>();
    public List<User> userFriends = new ArrayList<>();
    public List<Session> sessionFriends = new ArrayList<>();
    //public String f;
    
    public User(String username, String password, Session s){
        try{
            //connect to database
            super.connect();
            this.username = username;
            this.password = password;
            this.sesh = s;
        }
        catch(Exception e){
            e.getStackTrace();
        }
    }
    
    public Boolean login(){
        try {
            if(super.login(this)){
                //if login worked, load new data
                this.data = super.userData(this);
                //load the users friends
                this.friends = super.userFriends(this);
                return true;
            }
        } catch (Exception ex) {
            Logger.getLogger(User.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false;
    }
    
    public void sendMessage(User reciever){
        
       //reciever.sesh.
        
    }
    
    public String test(){
        return "Hello from message";
    }
    
}