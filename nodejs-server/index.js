const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const url = require("url");

const {
  vehiclesPageTemplate,
  singleVehiclePageTemplate,
  singleVehicleTemplate,
} = require("./templates");
const { vehicles } = require("./vehicles");

// The createServer() method of http creates a new HTTP server instance and returns it.
// Whenever a new request is received, the request event is fired on server, providing two objects: a request (an http.IncomingMessage object) and a response (an http.ServerResponse object).
const server = http.createServer(async (req, res) => {
  // req - Provides the request details.
  // res - Used to return data to the caller.

  // console.log(req.url); // path
  // console.log(req.method); // http method
  // console.log(req.headers); // headers of request

  /* 
    Routing =>
    All requests are treated the same. We can use switch or if-else statements along with req.url and req.method to route the requests and process the response accordingly.
    */

  // const pathname = req.url;
  // To parse query parameters from path, req.url is not enough. We use 'url' core module.
  const { pathname, query } = url.parse(req.url, true);
  const httpMethod = req.method;

  if (pathname === "/" && httpMethod === "GET") {
    {
      // res.statusCode sets the status code of the response.
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.write("Hey there!\n");
      res.write("My name is Shrinivas\n");
      /* 
        res.end() sends response.
        No more data can be written to response after calling end(). Throws error if you do so.
        */
      res.end("Hello World\n");
      return;
    }
  }

  if (pathname === "/form" && httpMethod === "GET") {
    // res.writeHead(statusCode, headers) is shorthand to set multiple headers and statuscode together.
    res.writeHead(200, {
      "Content-Type": "text/html",
      "my-custom-header": "something something",
    });
    res.write(`
              <form method="post" action="/form">
                  <input name="text" type="text"/>
                  <button type="submit">Submit</button>
              </form>
          `);

    res.end();
    return;
  }

  if (pathname === "/form" && httpMethod === "POST") {
    const body = [];

    // You can use data event of request object to store the chunks of data into array.
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    // Then you can use end event to know that complete data has been received and so start working on it.

    req.on("end", () => {
      // You need to convert the chunks into buffer. Which can be done using Buffer class.
      const buffer = Buffer.concat(body);
      // Convert Buffer object into string. You also have toJSON()
      const parsedBody = buffer.toString();
      // console.log(parsedBody); // text=something
      const text = parsedBody.split("=")[1];
      fs.writeFile("log.txt", `${text}\n`, { flag: "a" });
    });

    // Location response header indicates URL to redirect a page to. It monly provides the meaning when served with 3xx(redirection) or 201(created) status codes.
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
    return;
  }

  if (pathname === "/api" && httpMethod === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(vehicles));
    return;
  }

  if (pathname === "/vehicles" && httpMethod === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    // Fill template
    const renderedVehicles = vehicles
      .map((vehicle) => {
        let output = singleVehicleTemplate.replaceAll(
          "{%vehicleImage%}",
          vehicle.image
        );
        output = output.replaceAll("{%vehicleName%}", vehicle.name);
        output = output.replaceAll("{%vehicleYear%}", vehicle.year);
        output = output.replaceAll("{%vehicleId%}", vehicle.id);

        return output;
      })
      .join("");

    const renderedVehiclesTemplate = vehiclesPageTemplate.replace(
      "{%vehiclesList%}",
      renderedVehicles
    );

    res.end(renderedVehiclesTemplate);
    return;
  }

  if (pathname === "/vehicles/single" && httpMethod === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const vehicleId = Number(query.id);

    // Fill template
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (!vehicle) {
      res.statusCode = 404;
      res.end("404 not found");
      return;
    }

    let renderedSingleVehiclePageTemplate = singleVehiclePageTemplate.replace(
      "{%vehicleName%}",
      vehicle.name
    );
    renderedSingleVehiclePageTemplate =
      renderedSingleVehiclePageTemplate.replace(
        "{%vehicleImage%}",
        vehicle.image
      );
    renderedSingleVehiclePageTemplate =
      renderedSingleVehiclePageTemplate.replace(
        "{%vehicleYear%}",
        vehicle.year
      );

    res.end(renderedSingleVehiclePageTemplate);
    return;
  }

  // If route is not available send 404 response.
  res.statusCode = 404;
  res.end("404 not found");
});

// The server is set to listen on the specified port and host name. When the server is ready, the callback function is called, in this case informing us that the server is running.
const HOSTNAME = "127.0.0.1";
const PORT = 3000;
// By default server will listen for requests on our local machine which does not have a domain like google.com. We can skip HOSTNAME in following method.
// 127.0.0.1 => localhost
// We need PORT to specify where we are listening the requests on our local machine as there are many applications/servers running.
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

// Press CTRL + C to stop the server.
