#r "Newtonsoft.Json"
#load "BasicQnAMakerDialog.csx"

using System;
using System.Net;
using System.Threading;
using Newtonsoft.Json;

using Microsoft.Bot.Builder.Azure;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;


public static async Task<object> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info($"Webhook was triggered!");

    // Initialize the azure bot
    using (BotService.Initialize())
    {
        // Deserialize the incoming activity
        string jsonContent = await req.Content.ReadAsStringAsync();
        var activity = JsonConvert.DeserializeObject<Activity>(jsonContent);

        // authenticate incoming request and add activity.ServiceUrl to MicrosoftAppCredentials.TrustedHostNames
        // if request is authenticated
        if (!await BotService.Authenticator.TryAuthenticateAsync(req, new[] { activity }, CancellationToken.None))
        {
            return BotAuthenticator.GenerateUnauthorizedResponse(req);
        }

        if (activity != null)
        {
            // one of these will have an interface and process it
            switch (activity.GetActivityType())
            {
                case ActivityTypes.Message:
                int n;
                bool isNumeric = int.TryParse(activity.Text, out n);
                if (!isNumeric)
                {
                    await Conversation.SendAsync(activity, () => new BasicQnAMakerDialog());
                    break;
                }
                
                String json = "";
                dynamic item;
                try{
                    using (var client2 = new WebClient())
                    {
                        client2.Credentials = new NetworkCredential("zwoja4-ms2asm", "re36rym3mjqxm8ej2cscfajmxpsew33m");
                        json = client2.DownloadString($"http://api.sherpadesk.com/tickets/{activity.Text}?format=json");
    //var activity = JsonConvert.DeserializeObject<Activity>(jsonContent);
    //var serializer = new JavaScriptSerializer();
    //SomeModel model = serializer.Deserialize<SomeModel>(json);
    // TODO: do something with the model
                    }
                }
                catch (WebException ex)
{/*
    if (ex.Status == WebExceptionStatus.ProtocolError && ex.Response != null)
    {
        var resp = (HttpWebResponse)ex.Response;
        if (resp.StatusCode == HttpStatusCode.NotFound) // HTTP 404
        {
            //the page was not found, continue with next in the for loop
        }
    }
    //throw any other exception - this should not occur
    throw;
    */
}
var reply1 = activity.CreateReply();
reply1.Type = ActivityTypes.Message;
reply1.ChannelId = activity.ChannelId;
if (String.IsNullOrEmpty(json) || json == "Tickets not found"){
  reply1.Text += "**Not Found** Ticket #"+activity.Text +"";
  reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
  reply1.Text += "Please try again or Create New Ticket";
}
else {
  item = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
  reply1.Text += "Info about Ticket **#"+activity.Text +"**";
  reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
  reply1.Text += "Status: **" +  (string)item.status +  "**";
  reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
  reply1.Text += "Subject: **" + (string)item.subject + "**";
  reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
  reply1.Text += "Last reply *at " + ((string)item.ticketlogs[0].record_date).Substring(0,19) + "*: `" + (string)item.ticketlogs[0].note + "`";
  }             reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
  reply1.Text += "Type **logs** to view full story";
  
  var client1 = new ConnectorClient(new Uri(activity.ServiceUrl));
  await client1.Conversations.ReplyToActivityAsync(reply1);
  break;
  case ActivityTypes.ConversationUpdate:
  var client = new ConnectorClient(new Uri(activity.ServiceUrl));
  IConversationUpdateActivity update = activity;
  if (update.MembersAdded.Any())
  {
    var reply = activity.CreateReply();
    reply.Type = ActivityTypes.Message;
    reply.ChannelId = activity.ChannelId;
    var newMembers = update.MembersAdded?.Where(t => t.Id != activity.Recipient.Id);
    foreach (var newMember in newMembers)
    {
        reply.Text = "Welcome";
        if (!string.IsNullOrEmpty(newMember.Name))
        {
            reply.Text += $" {newMember.Name}";
        }
        reply.Text += "!";
        await client.Conversations.ReplyToActivityAsync(reply);
    }
}
break;
case ActivityTypes.ContactRelationUpdate:
case ActivityTypes.Typing:
case ActivityTypes.DeleteUserData:
case ActivityTypes.Ping:
default:
log.Error($"Unknown activity type ignored: {activity.GetActivityType()}");
break;
}
}
return req.CreateResponse(HttpStatusCode.Accepted);
}
}
