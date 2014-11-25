/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.sql.*;
import java.util.*;
/**
 *
 * @author alexander
 */
class Database{
    
    public Connection con;
    public Statement st;
    public ResultSet rs;
    public PreparedStatement prepSt;
       
    
    public void connect() throws Exception{
        Class.forName("com.mysql.jdbc.Driver");
        
        this.con = DriverManager.getConnection("jdbc:mysql://localhost/cri", "root", "");
        this.st = this.con.createStatement();        
    }
    public Boolean login(User u) throws Exception{
      
        String query = "SELECT * FROM users WHERE username = ? AND user_password = ?";
        
        prepSt = con.prepareStatement(query);
        prepSt.setString(1, u.username);
        prepSt.setString(2, u.password);
        rs = prepSt.executeQuery();
        
        
        if(rs.next()){
            return true; 
        }
        return false;
        
    }
    //get every thing about an user, this method is only called if user is logged in
    public Map<String, String> userData(User u) throws Exception{
        
        Map<String, String> temp = new HashMap<String, String>();
        
        String query = "SELECT * FROM users WHERE username = ? AND user_password = ?";
        
        prepSt = con.prepareStatement(query);
        prepSt.setString(1, u.username);
        prepSt.setString(2, u.password);
        rs = prepSt.executeQuery();
        
        if(rs.next()){
            temp.put("id", rs.getString("id"));
            temp.put("username", rs.getString("username"));
            temp.put("password", rs.getString("user_password"));
            temp.put("user_created", rs.getString("user_created"));
        }
        
        return temp;
    }
    /* public List<Friend> userFriends(User u) throws Exception{
        List<Friend> templist = new ArrayList<>();
        
        String query = "SELECT u2.id, u2.username FROM friendlist"
                + "INNER JOIN users u1 ON friendlist.userID = u1.id"
                + "INNER JOIN users u2 ON friendlist.friendID = u2.id"
                + "WHERE u1.username = ?";
        
        prepSt = con.prepareStatement(query);
        prepSt.setString(1, u.username);
        rs = prepSt.executeQuery();
        
        //Go through all friends
        while(rs.next()){
            templist.add(new Friend(rs.getString("id"), rs.getString("username")));
        }
        
        return templist;
    } */
}