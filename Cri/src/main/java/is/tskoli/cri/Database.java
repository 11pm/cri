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
      
        String query = "CALL login(?, ?)";
        
        prepSt = con.prepareStatement(query);
        prepSt.setString(1, u.username);
        prepSt.setString(2, u.password);
        rs = prepSt.executeQuery();
        
        
        return rs.next();
        
    }
    //get every thing about an user, this method is only called if user is logged in
    public Map<String, String> userData(User u) throws Exception{
        
        Map<String, String> temp = new HashMap<>();
        
        String query = "CALL login(?, ?)";
        
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
    public List<Map<String, String>> userFriends(User u) throws Exception{
        List<Map<String, String>> templist = new ArrayList<>();
        
        String query = "CALL friends(?)";
        
        prepSt = con.prepareStatement(query);
        prepSt.setString(1, u.data.get("id"));
        rs = prepSt.executeQuery();
        
        //go through all records
        while(rs.next()){
            Map<String, String> tempMap = new HashMap<>();
            
            tempMap.put("id", rs.getString("id"));
            tempMap.put("username", rs.getString("username"));
            templist.add(tempMap);
        }
        
        return templist;
    }
}