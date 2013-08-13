using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fleck;

namespace WebSocketsDemoServerHost
{
    class Program
    {
        static void Main(string[] args)
        {
            List<IWebSocketConnection> connections = new List<IWebSocketConnection>();
            var server = new WebSocketServer("ws://localhost:9090/Server");
            server.Start(con =>
                {
                    con.OnOpen += () =>
                        {
                            Console.WriteLine("A new connection is established");
                            connections.Add(con);
                        };
                    con.OnClose += () =>
                        {
                            Console.WriteLine("An existing connection is closed");
                            connections.Remove(con);
                        };
                    con.OnMessage += s =>
                        {
                            Console.WriteLine("Message Received - {0}", s);
                            connections.ForEach(c =>
                                {
                                    if (c != con) c.Send(s);
                                });
                        };
                });
            Console.WriteLine("Enter EXIT to shutdown or any other message to send to client");
            string input = string.Empty;
            while (!(input = Console.ReadLine()).ToUpper().Equals("EXIT"))
            {
                connections.ForEach(c => c.Send(input));
            }
            Console.WriteLine("Server shutdown!!!");
            
        }
    }

    public static class MyExtensions
    {
        public static void ForEach<T>(this IEnumerable<T> list, Action<T> action)
        {
            foreach (var item in list)
            {
                action(item);
            }
        }
    }
}
