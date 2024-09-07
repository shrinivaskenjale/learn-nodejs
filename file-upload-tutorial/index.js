const formData = new FormData();

formData.append("name", "shrinivas");
formData.append("age", 22);
formData.append("name", "raju");

for (let entry of formData) {
  console.log(entry);
}

console.log(formData.getAll("name"));
