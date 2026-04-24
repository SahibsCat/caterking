import re

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'r') as f:
    text = f.read()

# Add checkboxes into the form
checkbox_ui = """
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Packages</label>
                  <div className="space-y-2">
                    {ALL_PACKAGES.map(pkg => (
                      <label key={pkg} className="flex items-center gap-2 text-white">
                        <input 
                          type="checkbox" 
                          checked={formData.packages.includes(pkg)}
                          onChange={e => {
                            const newPkgs = e.target.checked 
                              ? [...formData.packages, pkg] 
                              : formData.packages.filter(p => p !== pkg);
                            setFormData({...formData, packages: newPkgs});
                          }}
                          className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                        />
                        {pkg}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Occasions</label>
                  <div className="space-y-2 h-32 overflow-y-auto">
                    {ALL_OCCASIONS.map(occ => (
                      <label key={occ} className="flex items-center gap-2 text-white text-sm">
                        <input 
                          type="checkbox" 
                          checked={formData.occasions.includes(occ)}
                          onChange={e => {
                            const newOcc = e.target.checked 
                              ? [...formData.occasions, occ] 
                              : formData.occasions.filter(o => o !== occ);
                            setFormData({...formData, occasions: newOcc});
                          }}
                          className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                        />
                        {occ}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">"""

text = text.replace('              <div className="flex justify-end gap-3 mt-6">', checkbox_ui)

# Make Reset Add Item button reset correctly (it missed occasions/packages before script 2)
text = text.replace(
    "setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', is_active: true });",
    "setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', packages: [], occasions: [], is_active: true });"
)

# Replace table is_active display with a toggle 
toggle_ui = """<td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleActive(item)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.is_active ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="ml-2 text-sm text-gray-400">{item.is_active ? 'Active' : 'Inactive'}</span>
                  </td>"""

text = re.sub(
    r"<td className=\"px-6 py-4\">\s*<span className=\{\`w-2 h-2 rounded-full inline-block mr-2.+?\s*\{item\.is_active \? 'Active' : 'Inactive'\}\s*</td>",
    toggle_ui,
    text,
    flags=re.DOTALL
)

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'w') as f:
    f.write(text)

print("Done")
