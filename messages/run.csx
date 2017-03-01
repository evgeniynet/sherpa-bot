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
				StateClient stateClient = activity.GetStateClient();
				BotData userData = await stateClient.BotState.GetUserDataAsync(activity.ChannelId, activity.From.Id);

				String userMessage = activity.Text;
				bool isNumeric = false;
				bool isSearch = userMessage.StartsWith("search", StringComparison.InvariantCultureIgnoreCase);
				bool isLogs = userMessage.StartsWith("logs", StringComparison.InvariantCultureIgnoreCase);
				int n;
			    isNumeric = int.TryParse(userMessage, out n);
				if (!isLogs && !isSearch)
				{
				if (!isNumeric) 
				{
				    userData.SetProperty<int>("Ticket", 0);
				    await stateClient.BotState.SetUserDataAsync(activity.ChannelId, activity.From.Id, userData);
					
					await Conversation.SendAsync(activity, () => new BasicQnAMakerDialog());
					break;
				}
				}

				String json = "", ticket = "";
				dynamic item;
				
				if (isLogs)
				{
				    ticket = userMessage.Substring(4).Trim();
				    if (int.TryParse(ticket, out n))
				    {
				        userData.SetProperty<int>("Ticket", n);
					    await stateClient.BotState.SetUserDataAsync(activity.ChannelId, activity.From.Id, userData);
				    }
				    else if (userData.GetProperty<int>("Ticket") > 0)
				    {
				    ticket = userData.GetProperty<int>("Ticket").ToString();
				    }
				    else
				    ticket = "";
				}
				else if (isNumeric)
                ticket = userMessage;
                else if (isSearch)
                ticket = userMessage.Substring(6).Trim();
                
                if (ticket != ""){
				try{
					using (var client2 = new WebClient())
					{
						client2.Credentials = new NetworkCredential("zwoja4-ms2asm", "re36rym3mjqxm8ej2cscfajmxpsew33m");
						String url = "http://api.sherpadesk.com/";
						if (isSearch)
						    url += $"tickets?query=all&search={ticket}*&limit=20&";
						else
						    url += $"tickets/{ticket}?";
						url += "format=json";
						json = client2.DownloadString(url);
						//var activity = JsonConvert.DeserializeObject<Activity>(jsonContent);
						//var serializer = new JavaScriptSerializer();
						//SomeModel model = serializer.Deserialize<SomeModel>(json);
						// TODO: do something with the model
					}
				}
				catch (WebException ex)
				{
				/*
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
                }
				
				var reply1 = activity.CreateReply();
				reply1.Type = ActivityTypes.Message;
				reply1.ChannelId = activity.ChannelId;
				if (String.IsNullOrEmpty(json) && ticket != ""){
					reply1.Text += "**Not Found** Ticket #"+ticket +"";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += "Please try again or Create New Ticket";
				}
				else if (ticket == "" && (isLogs || isSearch))
				{
				    reply1.Text += isSearch ? "**Cannot** search Tickets" : "**Cannot** found Ticket Logs";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += "Please type " + (isSearch ? "search string" : "correct Ticket **number**") + " first";
				}
				else if (isSearch)
				{
				    item = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
				    if (item.Count == 0)
				    {
				        reply1.Text += "**Not Found** Ticket #"+ticket +"";
					    reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					    reply1.Text += "Please try again or Create New Ticket";
				    }
				    else
				    {
				        reply1.Text += "Found **"+item.Count +"** Ticket(s):";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += $" --- {Environment.NewLine} {Environment.NewLine}";
			        
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					for (int i = 0; i < item.Count; i++) {
					    reply1.Text += "*" + (string)item[i].status + "* #**" + (string)item[i].number + "** " + (string)item[i].subject;
					    reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					    reply1.Text += $" --- {Environment.NewLine} {Environment.NewLine}";
			        }
				    reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += $"To view ticket info type its number";
			        
				    }
				}
				else if (userData.GetProperty<int>("Ticket") > 0 && isLogs){
					item = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
					reply1.Text += "Logs of *" + (string)item.status + "* Ticket #**"+ticket +"** "+ (string)item.subject +" :";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += $" --- {Environment.NewLine} {Environment.NewLine}";
			        
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					for (int i = 0; i < item.ticketlogs.Count; i++) {
					    reply1.Text += "*" + ((string)item.ticketlogs[i].record_date).Substring(0,19) + "*: `" + (string)item.ticketlogs[i].note + "`";
					    reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					    reply1.Text += $" --- {Environment.NewLine} {Environment.NewLine}";
			        }
				}
				else 
				{
					userData.SetProperty<int>("Ticket", n);
					await stateClient.BotState.SetUserDataAsync(activity.ChannelId, activity.From.Id, userData);
					item = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
					reply1.Text += "Info about Ticket **#"+ticket +"**";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += "Status: **" +  (string)item.status +  "**";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += "Subject: **" + (string)item.subject + "**";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
					reply1.Text += "Last reply *at " + ((string)item.ticketlogs[0].record_date).Substring(0,19) + "*: `" + (string)item.ticketlogs[0].note + "`";
					reply1.Text += $"{Environment.NewLine} {Environment.NewLine}";
				    reply1.Text += "Type **logs** to view full story";
				}             

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
