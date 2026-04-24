import re

with open('/home/arz/sahibscatering/frontend/src/pages/BookingFlow.tsx', 'r') as f:
    text = f.read()

# 1. MenuItem types
interface_def = """export interface MenuItem {
  id: string;
  name: string;
  category: string;
  dietary: 'Veg' | 'Non-Veg' | 'Mixed';
  weight_ratio: number;
  packages: string[];
  occasions: string[];
  is_active: boolean;
}"""

text = re.sub(
    r"import \{ type MenuItem \} from '../services/mockData';",
    "import { type MenuItem } from '../services/mockData';\n" + interface_def,
    text
)

# 2. Fetch processing
fetch_block = """        const mapped = data.map((d: any) => ({
          ...d,
          id: d._id,
          dietary: d.dietary_tag,
          weight_ratio: d.weight_ratio_per_10_guests,
          packages: d.packages || [],
          occasions: d.occasions || [],
          is_active: d.is_active !== undefined ? d.is_active : true
        }));"""

text = re.sub(r"const mapped = data\.map[\s\S]+?\}\)\);", fetch_block, text)

# 3. Add text to Step 1 (index 1 is Package selection)
text = text.replace(
    "Choose Your Package</h2>",
    "Choose Your Package</h2>\n              <div className=\"text-gray-400 mb-8\">- to customize your menu click next.</div>"
)

# 4. Filter by active and package
menu_filter = """{menuItems
                          .filter(i => i.is_active)
                          .filter(i => !i.packages || i.packages.length === 0 || i.packages.includes(formData.package))
                          .filter(i => i.category === cat)
                          .filter(i => {"""

text = re.sub(
    r"\{menuItems\s+\.filter\(i => i\.category === cat\)\s+\.filter\(i => \{",
    menu_filter,
    text
)

# 5. Fix submit booking
submit_logic = """  const handleCompleteBooking = async () => {
    try {
      const orderPayload = {
        orderId: `ORD-${Date.now()}`,
        userId: '60d0fe4f5311236168a109ca', // mock user ID for now since we don't have login, or we should use real ID
        eventDetails: {
          venue: formData.venue,
          date: formData.date,
          guestCount: formData.guests,
          occasion: formData.occasion,
          foodPreference: formData.foodPreference,
          serviceType: formData.serviceType
        },
        packageId: '60d0fe4f5311236168a109ca', // also mock
        selectedMenu: formData.selectedItems.map(i => ({
          itemId: i.id,
          name: i.name,
          category: i.category,
          calculatedWeight: formData.guests / 10 * i.weight_ratio
        })),
        additionalChoices: [],
        pricing: {
          total: ((formData.package === 'Standard' ? 120 : formData.package === 'Premium' ? 180 : 250) * formData.guests) * 1.05
        },
        status: 'pending'
      };
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });
      if (response.ok) {
        alert('Booking successfully placed!');
        window.location.href = '/';
      } else {
        alert('Error placing booking');
      }
    } catch (err) {
      console.error(err);
    }
  };"""

# inject right before `const [showInclusionPopup, setShowInclusionPopup] = useState(false);`
text = text.replace("const [showInclusionPopup, setShowInclusionPopup] = useState(false);", submit_logic + "\n\n  const [showInclusionPopup, setShowInclusionPopup] = useState(false);")

# hook up button
text = text.replace(
    """<button className="bg-tan text-richBlack px-8 py-3 rounded-full font-bold hover:scale-105 transition-all">
                    Proceed to Payment
                  </button>""",
    """<button onClick={handleCompleteBooking} className="bg-tan text-richBlack px-8 py-3 rounded-full font-bold hover:scale-105 transition-all">
                    Checkout & Confirm
                  </button>"""
)

with open('/home/arz/sahibscatering/frontend/src/pages/BookingFlow.tsx', 'w') as f:
    f.write(text)

print("Done")
