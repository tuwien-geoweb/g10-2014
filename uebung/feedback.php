<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="navigation_gr10.css" rel="stylesheet" type="text/css" /></head>

<body>
<table width="848" height="653" border="1" align="center">
  <tr>
    <td width="650" height="80"><img src="head.jpg" width="840" height="89" /></td>
  </tr>
  <tr>
    <td height="35" class="navigation"> <a href="home.php">HOME</a> I PROJEKT I TEAM I <a href="feedback.php">FEEDBACK</a> I IMPRESSUM </td>
  </tr>
  <tr>   
    <td><p>&nbsp;</p>
    
        <h2>Feedback-Formular Gruppe 10</h2>

    <form method="POST" action="feedback_send.php">
      <input type="radio" name="geschlecht" value="Frau"/> Frau
      <input type="radio" name="geschlecht" value="Herr"/> Herr<br />
      <table>
        <tr><td>Name:</td>
          <td><input type="text" name="name" size="50" /></td>
        </tr>
        <tr><td>E-Mail: </td>
          <td><input type="text" name="email" size="50" /></td>
        </tr>
      </table>
      Feedback: <br />
      <textarea name="message" rows="10" cols="50"></textarea>
      <br />
      <input type="checkbox" name="team" checked="checked" value="ON" />
         Ich bin Mitglied des geoweb-Teams <br /><br />
      <input type="submit" value="Abschicken">
      <input type="reset" value="Zurücksetzen"> <br /><br />
      Ihr Feedback wird per E-Mail an die Autoren/innen zugestellt<br>
      und in der Projekt-Datenbank gespeichert.<br /><br />
      <br />
    </form>

    <p>geoweb.m10 (JB), Beispiel ausgehend von<br />
    <a href="http://www.thesitewizard.com/archive/feedbackphp.shtml" 
    target="_blank"> PHP Tutorial: Feedback Form Script</a> </p>

    
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p></td>
  </tr>
</table>
</body>
</html>