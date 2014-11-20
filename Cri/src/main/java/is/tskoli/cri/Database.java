/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.sql.*;
/**
 *
 * @author alexander
 */
public class Database{
    
    public Connection con;
    public Statement st;
    public ResultSet rs;
    public PreparedStatement prepSt;
       
    
    public void connect() throws Exception{
        Class.forName("com.mysql.jdbc.Driver");
        
        this.con = DriverManager.getConnection("jdbc:mysql://localhost/cri", "root", "");
        this.st = this.con.createStatement();        
    }
    public Boolean login(User user) throws Exception{
      
        String query = "SELECT * FROM users WHERE username = ? AND user_password = ?";
        
        prepSt = con.prepareStatement(query);
        prepSt.setString(1, user.username);
        prepSt.setString(2, user.password);
        rs = prepSt.executeQuery();
        
        
        if(rs.next())
            return true;
        return false;
        
    }
}
