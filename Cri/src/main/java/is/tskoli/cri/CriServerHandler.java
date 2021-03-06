/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;

import java.io.IOException;
import java.util.*;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.*;
import java.util.logging.*;
/**
 *
 * @author alexander
 */
@ServerEndpoint("/server")
public class CriServerHandler{
    //all currect users online
    private static final Set<Session> allUsers = Collections.synchronizedSet(new HashSet<Session>());
    //the user connected by ws
    private User client;
    //the json from client
    private JSONObject json;
    
    @OnMessage
    public void handleClient(String jsonFromClient, Session s) {
        
        //convert string from client to JSON
        try {
            this.json = new JSONObject(jsonFromClient);
        } catch (JSONException ex) {
            Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        try {
            //handle what the client sends to us, parse the type
            switch(this.json.getString("type")){
                //user request server to log him in
                case "login":
                    
                    //get the data from client
                    this.json = this.json.getJSONObject("data");
                    String username = (String) this.json.get("username");
                    String password = (String) this.json.get("password");
                    
                    //create User object
                    s.getUserProperties().put("user", new User(username, password, s));
                    //get the User obj stored in session
                    client = (User) s.getUserProperties().get("user");
                    try {
                        //check if cretentials are correct
                        if(client.login()){
                            //return user details, user friends                           
                                    
                            List<Map<String, String>> friends = client.friends;
                            Map<String, String> details = client.data;
                            List<Map<String, String>>  groups = client.groups;
                            
                            //send the response to the user that requested it 
                            s.getBasicRemote().sendText(
                                new JSONObject()
                                    .put("type", "login")
                                    .put("success", true)
                                    .put("details", details)
                                    .put("friends", friends)
                                    .put("groups", groups)
                                    .toString()
                            );
                            
                        }
                        else{
                            
                            //send {"success": falseto client
                            s.getBasicRemote().sendText(
                                new JSONObject()
                                    .put("type", "login")
                                    .put("success", false)
                                    .toString()
                            );
                            
                        }
                    } catch (JSONException | IOException ex) {
                        Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    break;
                    
                //handle private messages from the client
                case "private":
                    
                    //go through all users and check if they are the correct ones to send to
                    for (Session sesh : CriServerHandler.allUsers){
                        //send message to correct user
                        client.sendPrivate(sesh, this.json.getJSONObject("data"));                        
                    }
           
                    break;
                //handle group messages from the client
                case "groupmessage":
                    
                    //go through all users and check if they are the correct ones to send to
                    for (Session sesh : CriServerHandler.allUsers){
                        client.sendGroup(sesh, this.json.getJSONObject("data"));
                    }
                    
                    break;
                
            }
        } catch (JSONException ex) {
            Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }
    
    //when a user opens the app in browser we set the session for later use
    @OnOpen
    public void onOpen (Session peer) {
        
        //and add him to the online user list
        allUsers.add(peer);
    }

    @OnClose
    public void onClose (Session peer) {
        
        //get details about the user that is closing, set him offline
        User closingUser = (User) peer.getUserProperties().get("user");
        closingUser.online = false;
        //update the user
        peer.getUserProperties().put("user", closingUser);
        
        allUsers.remove(peer);
    }

    @OnError
    public String onError(Throwable t) {
        return t.getMessage();
    }
  
}