// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs').promises
/**
 * Node Class (GIVEN, you will need to use this)  
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    const newNode = new Node(newStudent);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
  let current = this.head;
  let previous = null;

  while (current !== null) {
    if (current.data.getEmail() === email) {

      // removing head
      if (previous === null) {
        this.head = current.next;
      } else {
        previous.next = current.next; // normal case
      }

      // removing tail
      if (current === this.tail) {
        this.tail = previous;
      }
      this.length--;
      return; 
    }
    previous = current;
    current = current.next;
  }
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    let current = this.head;

    while (current !== null) {
      if (current.data.getEmail() === email) {
        return current.data;
      }
      current = current.next;
    }

    return -1;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  #clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;  
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let current = this.head;
    let result = [];

    while (current !== null) {
      result.push(current.data.getName());
      current = current.next;
    }

    return result.join(", ");
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    let arr = [];
    let current = this.head;

    while (current !== null) {
      arr.push(current.data);
      current = current.next;
    }

    return arr.sort((a, b) => 
      a.getName().localeCompare(b.getName())
    );
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    const sorted = this.#sortStudentsByName();

    return sorted.filter(
      student => student.getSpecialization() === specialization
    );
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    // TODO
    const currentYear = new Date().getFullYear();
    const sorted = this.#sortStudentsByName();

    return sorted.filter(student => {
      const age = currentYear - student.getYear();
      return age >= minAge;
    });
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO
      let arr = [];
    let current = this.head;

    while (current !== null) {
      arr.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization()
      });
      current = current.next;
    }

    await fs.writeFile(fileName, JSON.stringify(arr, null, 2));    
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    const data = await fs.readFile(fileName, 'utf-8');
    const arr = JSON.parse(data);

    this.#clearStudents(); 

    for (let obj of arr) {
      const student = new Student(
        obj.name,
        obj.year,
        obj.email,
        obj.specialization
      );
      this.addStudent(student);
    }    
  }

}

module.exports = { LinkedList }
