const UserContact = require("../models/UserContact");

const addContact = async (req, res) => {
    try {
        const { name, email, mobile, category } = req.body;

        if (!name || !email || !mobile) {
            return res.status(400).json({ status: '400', message: "Name, email, and mobile are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: '400', message: "Invalid email format" });
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ status: 400, message: "Invalid mobile number format" });
        }

        const duplicateContact = await UserContact.findOne({
            $or: [
                { email: email, user: req.user._id },
                { mobile: mobile, user: req.user._id },
                { name: name, user: req.user._id }
            ]
        });

        if (duplicateContact) {
            return res.status(400).json({ status: '400', message: "A contact with the same email, mobile, or name already exists." });
        }

        const newContact = new UserContact({
            name,
            email,
            mobile,
            category,
            user: req.user._id
        });

        await newContact.save();

        res.status(201).json({status: '201', message: "Contact added successfully" });

    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// const getContactsByUser = async (req, res) => {
//     try {
//         const { page = 1, name = '', email = '', mobile = '', category = '', status = '' , sortBy = 'name', sortOrder = 'asc' } = req.query;

//         const limitNum = 25;
//         const pageNum = parseInt(page, 10);
//         const skip = (pageNum - 1) * limitNum;

//         const filter = {};
//         if (name) filter.name = { $regex: name, $options: 'i' };
//         if (email) filter.email = { $regex: email, $options: 'i' };
//         if (category) filter.category = { $regex: category, $options: 'i' };
//         if(status) filter.status = { $regex: status, $options: 'i' };
//         if (mobile) filter.mobile = { $regex: mobile, $options: 'i' };

//         const sort = {};
//         sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//         const contacts = await UserContact.find({ user: req.user._id, ...filter })
//             .skip(skip)
//             .limit(limitNum)
//             .sort(sort);

//         const totalContacts = await UserContact.countDocuments({ user: req.user._id, ...filter });

//         const totalPages = Math.ceil(totalContacts / limitNum);

//         res.status(200).json({
//             contacts,
//             pagination: {
//                 currentPage: pageNum,
//                 totalPages,
//                 totalContacts,
//                 limit: limitNum,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching contacts:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };


const getContactsByUser = async (req, res) => {
    try {
        const { page = 1, name = '', email = '', mobile = '', category = '', status = '', sortBy = 'name', sortOrder = 'asc', isFavorite = '' } = req.query;

        const limitNum = 25;
        const pageNum = parseInt(page, 10);
        const skip = (pageNum - 1) * limitNum;

        const filter = {};
        
        if (isFavorite === 'YES') {
            filter.isFavorite = 'YES'; 
        } else if (isFavorite === 'NO') {
            filter.isFavorite = 'NO'; 
        }

        
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (email) filter.email = { $regex: email, $options: 'i' };
        if (category) filter.category = { $regex: category, $options: 'i' };
        if (status) filter.status = { $regex: status, $options: 'i' };
        if (mobile) filter.mobile = { $regex: mobile, $options: 'i' };

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const contacts = await UserContact.find({ user: req.user._id, ...filter })
            .skip(skip)
            .limit(limitNum)
            .sort(sort);

        const totalContacts = await UserContact.countDocuments({ user: req.user._id, ...filter });

        const totalPages = Math.ceil(totalContacts / limitNum);

       
        if (isFavorite === 'YES' && totalContacts === 0) {
            return res.status(200).json({
                message: 'No favorite contacts available.',
                contacts: [],
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalContacts,
                    limit: limitNum,
                },
            });
        }

        res.status(200).json({
            contacts,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalContacts,
                limit: limitNum,
            },
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Server error" });
    }
};



const getcontactsByGroup = async (req, res) => {
    try {
        const { page = 1, name = '', email = '', mobile = '', category = '', status = 'active', sortBy = 'name', sortOrder = 'asc' } = req.query;

        const limitNum = 25;
        const pageNum = parseInt(page, 10);
        const skip = (pageNum - 1) * limitNum;

        const filter = { status: 'Active' };  // Only show active contacts
        
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (email) filter.email = { $regex: email, $options: 'i' };
        if (category) filter.category = { $regex: category, $options: 'i' };
        if (mobile) filter.mobile = { $regex: mobile, $options: 'i' };

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const contacts = await UserContact.find({ user: req.user._id, ...filter })
            .skip(skip)
            .limit(limitNum)
            .sort(sort);

        const totalContacts = await UserContact.countDocuments({ user: req.user._id, ...filter });

        const totalPages = Math.ceil(totalContacts / limitNum);

        res.status(200).json({
            contacts,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalContacts,
                limit: limitNum,
            },
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Server error" });
    }
};




const updatecontact = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id;
    const { name, email, mobile, category } = req.body;

    try {
        if (!name || !email || !mobile) {
            return res.status(400).json({ status: '400', message: "Name, email, and mobile are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: '400', message: "Invalid email format" });
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ status: '400', message: "Invalid mobile number format" });
        }

        const contact = await UserContact.findOne({ _id: id, user: user_id });
        if (!contact) {
            return res.status(404).json({ status: '404', message: "Contact not found" });
        }

        const duplicateEmail = await UserContact.findOne({
            email: email,
            user: user_id,
            _id: { $ne: id }
        });

        if (duplicateEmail) {
            return res.status(400).json({ status: '400', message: "A contact with the same email already exists." });
        }

        const duplicateMobile = await UserContact.findOne({
            mobile: mobile,
            user: user_id,
            _id: { $ne: id }
        });

        if (duplicateMobile) {
            return res.status(400).json({ status: '400', message: "A contact with the same mobile number already exists." });
        }

        const duplicateName = await UserContact.findOne({
            name: name,
            user: user_id,
            _id: { $ne: id }
        });

        if (duplicateName) {
            return res.status(400).json({ status: '400', message: "A contact with the same name already exists." });
        }

        contact.name = name;
        contact.email = email;
        contact.mobile = mobile;
        contact.category = category;

        await contact.save();

        res.status(200).json({ status: '200', message: "Contact updated successfully" });

    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const isFavorite = async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await UserContact.findById(id);
        
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        contact.isFavorite = contact.isFavorite === 'YES' ? 'NO' : 'YES';

        await contact.save();

        res.status(200).json({ message: "Contact favorite status updated successfully" });

    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deletecontact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await UserContact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getContactById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id
    try {
        const contact = await UserContact.findOne({ _id:id, user:user_id }).select("-createdAt");

        if (!contact) {
            return res.status(404).json({  status: '404', message: "Contact not found" });
        }
        res.status(200).json(contact);
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({ status: '500', message: "Server error" });
    }
};

const updatecontactstatusflag = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id; 
    const { status } = req.body;  

    try {
        const contact = await UserContact.findOne({ _id: id, user: user_id });

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: "Contact not found"
            });
        }

        contact.status = status;
        await contact.save();

        res.status(200).json({
            status: 'success',
            message: "Contact status updated successfully"
        });

    } catch (error) {
        console.error("Error updating contact:", error.message);
        
        res.status(500).json({
            status: 'error',
            message: "Server error",
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

module.exports = { addContact, getContactsByUser , updatecontact, deletecontact , getContactById, updatecontactstatusflag,isFavorite , getcontactsByGroup};
