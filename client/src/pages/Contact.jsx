
function Contact(){
    
    return(
        <>
        <div className="contact-page">
            <h1>Contact Us</h1>
            <p>If you have any questions, feedback, or need assistance, please don't hesitate to reach out to our friendly customer support team. We're here to help you 24/7.</p>
            <div className="contact-details">
                <h2>Get In Touch</h2>
                <p><strong>Email:</strong> support@casota.com</p>
                <p><strong>Phone:</strong> +1 (800) 123-4567</p>
                <p><strong>Address:</strong> 47 Avenida da Casa Grande, Descanço dos Monges, Terra Sagrada</p>
                <h2>Follow Us</h2>
                <p>Stay updated with our latest offerings and news by following us on our social media channels:</p>
                <ul>
                <li><a href="https://facebook.com/">Facebook</a></li>
                <li><a href="https://instagram.com/">Instagram</a></li>
                <li><a href="https://twitter.com/">Twitter</a></li>
                </ul>
            </div>
            <div className="contact-form">
                <h2>Send Us a Message</h2>
                <form>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required />
                
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required />
                
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="6" required></textarea>
                
                <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Contact