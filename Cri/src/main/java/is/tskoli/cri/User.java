/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.io.IOException;
import java.text.SimpleDateFormat;
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
    
    //the user Session
    public Session sesh;
   
    //data to send to client from database
    public Map<String, String> data = new HashMap<>();
    public List<Map<String, String>> friends = new ArrayList<>();
    public List<User> userFriends = new ArrayList<>();
    public List<Session> sessionFriends = new ArrayList<>();
    public List<Map<String, String>> groups = new ArrayList<>();
    
    
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
                this.groups = super.userGroups(this);
                
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
    
    public Boolean isInGroup(String user, String group){
        
        return super.inGroup(user, group);
    }
    
    //Sends a personal message to a certain user
    public void sendPrivate(Session to, JSONObject data){
       
        
        try {
            //get the data from the client
            String message  = data.getString("message");
            String sender   = data.getString("sender");
            String receiver = data.getString("receiver");
            
            //get the User object from the session
            User userTo = (User) to.getUserProperties().get("user");
            
            //if he is a friend and he is the person you wanted to talk to
            if(this.isFriend(userTo.username) && receiver.equals(userTo.username)){
                String responseMessage = new JSONObject()
                    .put("type", "PM")
                    .put("message", message)
                    .put("sender", sender)
                    .put("receiver", receiver)
                    .put("timestamp", this.getTimestamp())
                    .toString();
                
                //send the "fake" JSON response to both you and the receiver 
                Message.sendToBoth(this.sesh, to, responseMessage);
                
            }

        } catch (JSONException ex) {
            Logger.getLogger(User.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }
    
    //sends to everybody in a desired group, checks is the user is correct one
    public void sendGroup(Session to, JSONObject data){
        
        try {
            //gets the data from the client
            JSONObject group  = data.getJSONObject("group");
            String sender = data.getString("sender");
            String message = data.getString("message");
            
            //gets the User object from the session
            User receiver = (User) to.getUserProperties().get("user");
           
            //if the person to send to is in the group
            if(this.isInGroup(receiver.data.get("id"), group.getString("id"))){
                String responseMessage = new JSONObject()
                    .put("type", "group")
                    .put("message", message)
                    .put("group", group)
                    .put("sender", sender)
                    .put("timestamp", this.getTimestamp())
                    .toString();
                
                //only send to users in the group
                Message.send(to, responseMessage);
                
            }
            
        } catch (JSONException ex) {
            Logger.getLogger(User.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private String getTimestamp(){
        return new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
    }
        
    
}