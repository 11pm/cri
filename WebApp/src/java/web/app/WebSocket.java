/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.app;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author alexander
 */
@ServerEndpoint("/test")
public class WebSocket {
    
    @OnOpen
    public void onOpen(Throwable t) {
        
    }
    
    
    @OnMessage
    public String onMessage(String message) {
        return null;
    }

    @OnClose
    public void onClose(Throwable t) {
    }

    @OnError
    public void onError(Throwable t) {
    }
    public static void main(String[] args){
        System.out.print("Hello");
    }
    
}
