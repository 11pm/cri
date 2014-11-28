/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.io.IOException;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;
import org.json.JSONException;
import org.json.JSONObject;
/**
 *
 * @author alexander
 */
public class User extends Database{
    
    public String username;
    public String password;
    public Boolean online = true;
    
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
    
    //check if username is in friendlist
    public Boolean isFriend(String username){
     
        for(Map<String, String> friend : this.friends){
            if(friend.get("username").equals(username)){
                return true;
            }
        }
        
        return false;
    }
    
    public void sendPrivate(Session to, JSONObject data){
       
        
        try {
            String message  = data.getString("message");
            String sender   = data.getString("sender");
            String receiver = data.getString("receiver");
            
            String responseMessage = new JSONObject().put("message", message).put("sender", sender).put("receiver", receiver).toString();
            User userTo = (User) to.getUserProperties().get("user");
            
            //if he is a friend
            if(this.isFriend(userTo.username)){
                this.sendToBoth(to, responseMessage);
            }

        } catch (JSONException ex) {
            Logger.getLogger(User.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }
        
    
    
    //Send a message to a receiver
    private void send(Session to, String message){
        try {
            to.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            Logger.getLogger(User.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    //Send to receiver/user
    private void sendToBoth(Session to, String message){
        try {
            to.getBasicRemote().sendText(message);
            this.sesh.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            Logger.getLogger(User.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}