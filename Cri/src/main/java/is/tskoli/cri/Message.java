/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;
import org.json.*;
/**
 *
 * @author alexander
 */
public class Message {
    
    //Send only to receiver
    public static void send(Session from, Session to, String message){
        try {
            to.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            Logger.getLogger(Message.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    //Send to both send and receiver
    public static void sendToBoth(Session from, Session to, String message){
        try {
            Message.send(from, to, message);
            from.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            Logger.getLogger(Message.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
