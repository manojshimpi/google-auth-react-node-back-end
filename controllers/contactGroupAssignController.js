const ContactAssignGroups = require('../models/ContactAssignGroup');
const Group = require('../models/Group');
const UserContact = require('../models/UserContact');


// Assign a single contact to a group
// const assignContactToGroup = async (req, res) => {
//     const { contactId, groupId } = req.body;
//     //console.log(" I am add group single contact");
//     const addedBy = req.user._id;  // Assuming `req.user` contains the logged-in user's information
  
//     try {
//       // Validate contact and group existence
//       const contact = await UserContact.findById(contactId);
//       const group = await Group.findById(groupId);
  
//       if (!contact) {
//         return res.status(404).json({ message: 'Contact not found' });
//       }
//       if (!group) {
//         return res.status(404).json({ message: 'Group not found' });
//       }
  
//       // Check if the contact is already assigned to the group (avoid duplicates)
//       const existingAssignment = await ContactAssignGroups.findOne({ contact_id: contactId, group_id: groupId });
//       if (existingAssignment) {
//         return res.status(400).json({ message: 'Contact is already assigned to this group' });
//       }
  
//       // Create a new assignment record
//       const newAssignment = new ContactAssignGroups({
//         contact_id: contactId,
//         group_id: groupId,
//         added_by: addedBy,  // Associate the user who added the contact
//       });
  
//       await newAssignment.save();
      
//       return res.status(200).json({ message: 'Contact assigned to group successfully', newAssignment });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Server Error' });
//     }
//   };
  
// const assignMultipleContacts = async (req, res) => {
//     console.log(" I am add group Multiple contact");
//     const { contactIds, groupId } = req.body;
//     const addedBy = req.user._id;  // Assuming `req.user` contains the logged-in user's information
    
//     try {
//       // Validate group existence
//       const group = await Group.findById(groupId);
//       if (!group) {
//         return res.status(404).json({ message: 'Group not found' });
//       }
  
//       // Create a list to hold the assignments
//       const assignments = [];
  
//       for (let contactId of contactIds) {
//         // Validate contact existence
//         const contact = await UserContact.findById(contactId);
//         if (!contact) {
//           continue;  // Skip if the contact is not found
//         }
  
//         // Check if the contact is already assigned to the group
//         const existingAssignment = await ContactAssignGroups.findOne({ contact_id: contactId, group_id: groupId });
//         if (!existingAssignment) {
//           // Create a new assignment
//           const newAssignment = new ContactAssignGroups({
//             contact_id: contactId,
//             group_id: groupId,
//             added_by: addedBy,  // Add the user who added the contact
//           });
  
//           // Save the assignment
//           assignments.push(newAssignment.save());
//         }
//       }
  
//       // Wait for all assignments to be saved
//       await Promise.all(assignments);
  
//       return res.status(200).json({ message: 'Contacts assigned to group successfully' });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Server Error' });
//     }
//   };



// Assign contacts (single or multiple) to a group


// Assign contacts (single or multiple) to a group
const assignContactsToGroup = async (req, res) => {
  const { contactIds, groupId } = req.body;
  const addedBy = req.user._id; // Assuming `req.user` contains the logged-in user's information

  try {
    // Validate group existence
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Convert single contactId to an array for uniformity
    const contacts = Array.isArray(contactIds) ? contactIds : [contactIds];
    
    // Create a list to hold the assignments
    const assignments = [];
    const existingAssignments = await ContactAssignGroups.find({
      contact_id: { $in: contacts },
      group_id: groupId
    });

    // Create a set of already assigned contacts for faster lookup
    const alreadyAssigned = new Set(existingAssignments.map(assign => assign.contact_id.toString()));

    // Create an array to store contacts that are already assigned to the group
    const duplicateContacts = [];

    for (let contactId of contacts) {
      if (alreadyAssigned.has(contactId.toString())) {
        duplicateContacts.push(contactId);  // Add duplicate contact to the array
        continue;  // Skip if the contact is already assigned to this group
      }

      // Validate contact existence
      const contact = await UserContact.findById(contactId);
      if (!contact) {
        continue;  // Skip if the contact is not found
      }

      // Create a new assignment
      const newAssignment = new ContactAssignGroups({
        contact_id: contactId,
        group_id: groupId,
        added_by: addedBy,  // Add the user who added the contact
      });

      // Save the assignment
      assignments.push(newAssignment.save());
      alreadyAssigned.add(contactId.toString());  // Add the contact to the alreadyAssigned set
    }

    // Wait for all assignments to be saved
    await Promise.all(assignments);

    // If there are duplicate contacts, return an error message
    if (duplicateContacts.length > 0) {
      return res.status(400).json({
        message: 'Some contacts are already assigned to this group.',
        duplicates: duplicateContacts
      });
    }

    return res.status(200).json({ message: 'Contacts assigned to group successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  assignContactsToGroup
};

