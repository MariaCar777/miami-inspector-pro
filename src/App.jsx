import React, { useState } from 'react';
import { Calendar, CheckSquare, Camera, AlertCircle, FileText, Clock, MapPin } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([
    {
      id: 1,
      address: '123 Ocean Drive, Miami Beach, FL 33139',
      projectName: 'Ocean Drive Renovation',
      permitNumber: 'RES-2025-001234',
      inspectionType: 'Electrical - Rough',
      status: 'Scheduled',
      scheduledDate: '2025-09-29',
      scheduledTime: '9:00 AM',
      attempts: 0,
      lastUpdate: '2025-09-28'
    },
    {
      id: 2,
      address: '456 Collins Ave, Miami Beach, FL 33140',
      projectName: 'Collins Condo Unit 302',
      permitNumber: 'RES-2025-001567',
      inspectionType: 'Electrical - Final',
      status: 'Failed',
      scheduledDate: '2025-09-27',
      attempts: 1,
      failureReasons: ['Spacing of receptacles not to code', 'Work not according to plans'],
      lastUpdate: '2025-09-27'
    }
  ]);

  const [newInspection, setNewInspection] = useState({
    address: '',
    projectName: '',
    permitNumber: '',
    inspectionType: 'Electrical - Rough',
    contactName: '',
    contactPhone: '',
    hvhzZone: true,
    floodZone: false
  });

  const [checklistItems, setChecklistItems] = useState([]);
  const [generatingChecklist, setGeneratingChecklist] = useState(false);

  const generateElectricalChecklist = async (inspectionType) => {
    setGeneratingChecklist(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const checklists = {
      'Electrical - Rough': [
        { id: 1, item: 'Verify all electrical work matches approved plans', checked: false, critical: true },
        { id: 2, item: 'Check receptacle spacing: max 12 feet apart per NEC 210.52', checked: false, critical: true },
        { id: 3, item: 'Verify GFCI protection in bathrooms, kitchen, outdoor areas', checked: false, critical: true },
        { id: 4, item: 'Confirm HVHZ-rated electrical boxes and mounting (175 mph wind rating)', checked: false, critical: true },
        { id: 5, item: 'Check proper wire gauge for circuit amperage', checked: false, critical: false },
        { id: 6, item: 'Verify grounding and bonding connections', checked: false, critical: true },
        { id: 7, item: 'Confirm junction boxes are accessible and properly covered', checked: false, critical: false },
        { id: 8, item: 'Check panel box location and clearance requirements', checked: false, critical: false },
        { id: 9, item: 'Verify all concealed work is exposed for inspection', checked: false, critical: true },
        { id: 10, item: 'Confirm Notice of Commencement posted on job site', checked: false, critical: true }
      ],
      'Electrical - Final': [
        { id: 1, item: 'Verify all devices installed per approved plans', checked: false, critical: true },
        { id: 2, item: 'Test all GFCI and AFCI devices for proper operation', checked: false, critical: true },
        { id: 3, item: 'Confirm all receptacles, switches, and fixtures functioning', checked: false, critical: true },
        { id: 4, item: 'Verify panel schedule matches actual installation', checked: false, critical: true },
        { id: 5, item: 'Check proper labeling of all circuits in panel', checked: false, critical: false },
        { id: 6, item: 'Confirm smoke detectors installed and interconnected', checked: false, critical: true },
        { id: 7, item: 'Verify CO detectors installed per code', checked: false, critical: true },
        { id: 8, item: 'Check outdoor lighting meets HVHZ impact requirements', checked: false, critical: true },
        { id: 9, item: 'Confirm all electrical rough inspection corrections completed', checked: false, critical: true },
        { id: 10, item: 'Verify Miami-Dade NOA documentation for all electrical materials', checked: false, critical: true }
      ],
      'Electrical - Service': [
        { id: 1, item: 'Verify service size matches approved plans and load calculations', checked: false, critical: true },
        { id: 2, item: 'Check proper service entrance cable rating', checked: false, critical: true },
        { id: 3, item: 'Confirm main panel meets HVHZ requirements', checked: false, critical: true },
        { id: 4, item: 'Verify grounding electrode system installation', checked: false, critical: false },
        { id: 5, item: 'Check proper bonding of service equipment', checked: false, critical: true },
        { id: 6, item: 'Confirm meter base installation and sealing', checked: false, critical: false },
        { id: 7, item: 'Verify weatherhead height and clearances', checked: false, critical: false },
        { id: 8, item: 'Check coordination with FPL for service connection', checked: false, critical: false }
      ]
    };

    setChecklistItems(checklists[inspectionType] || []);
    setGeneratingChecklist(false);
  };

  const getStatusColor = (status, attempts) => {
    if (status === 'Failed') {
      if (attempts >= 2) return 'bg-red-600 text-white';
      return 'bg-orange-500 text-white';
    }
    if (status === 'Passed') return 'bg-green-500 text-white';
    if (status === 'Scheduled') return 'bg-blue-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getPenaltyWarning = (attempts) => {
    if (attempts === 0) return null;
    if (attempts === 1) return { level: 'warning', message: 'Warning: Next failure = 2x fee' };
    if (attempts >= 2) return { level: 'critical', message: 'CRITICAL: Next failure = 4x fee ($500+ fine possible)' };
    return null;
  };

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{projects.filter(p => p.status === 'Scheduled').length}</div>
          <div className="text-sm text-gray-600 mt-1">Scheduled</div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
          <div className="text-3xl font-bold text-orange-600">{projects.filter(p => p.status === 'Failed' && p.attempts === 1).length}</div>
          <div className="text-sm text-gray-600 mt-1">1st Failure</div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
          <div className="text-3xl font-bold text-red-600">{projects.filter(p => p.attempts >= 2).length}</div>
          <div className="text-sm text-gray-600 mt-1">High Risk (2+ Fails)</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600">{projects.filter(p => p.status === 'Passed').length}</div>
          <div className="text-sm text-gray-600 mt-1">Passed</div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-semibold text-yellow-800">Miami-Dade Inspection Window</h3>
            <p className="text-sm text-yellow-700 mt-1">Inspector contact: 7:00-8:00 AM only | Schedule by 4:00 PM day before | Routes finalized 7:30-8:15 AM</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Active Inspections</h2>
        </div>
        <div className="divide-y">
          {projects.map(project => {
            const penalty = getPenaltyWarning(project.attempts);
            return (
              <div key={project.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{project.projectName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status, project.attempts)}`}>
                        {project.status}
                      </span>
                      {project.attempts > 0 && (
                        <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold">
                          Attempt #{project.attempts + 1}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {project.address}
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Permit: {project.permitNumber}</span>
                        <span>Type: {project.inspectionType}</span>
                      </div>
                      {project.scheduledDate && (
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <Calendar className="h-4 w-4" />
                          {project.scheduledDate} at {project.scheduledTime}
                        </div>
                      )}
                    </div>
                    {penalty && (
                      <div className={`mt-3 p-3 rounded ${penalty.level === 'critical' ? 'bg-red-100 border border-red-300' : 'bg-orange-100 border border-orange-300'}`}>
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`h-5 w-5 ${penalty.level === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                          <span className={`font-semibold ${penalty.level === 'critical' ? 'text-red-800' : 'text-orange-800'}`}>
                            {penalty.message}
                          </span>
                        </div>
                      </div>
                    )}
                    {project.failureReasons && (
                      <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                        <div className="font-semibold text-red-800 mb-2">Failure Reasons:</div>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                          {project.failureReasons.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const NewInspectionView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Schedule New Electrical Inspection</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Project Name *</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                placeholder="e.g., Ocean Drive Renovation"
                value={newInspection.projectName}
                onChange={(e) => setNewInspection({...newInspection, projectName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Permit Number *</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                placeholder="e.g., RES-2025-001234"
                value={newInspection.permitNumber}
                onChange={(e) => setNewInspection({...newInspection, permitNumber: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Property Address *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="123 Ocean Drive, Miami Beach, FL 33139"
              value={newInspection.address}
              onChange={(e) => setNewInspection({...newInspection, address: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Inspection Type *</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={newInspection.inspectionType}
                onChange={(e) => setNewInspection({...newInspection, inspectionType: e.target.value})}
              >
                <option>Electrical - Rough</option>
                <option>Electrical - Final</option>
                <option>Electrical - Service</option>
                <option>Electrical - Temporary Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Contact Phone *</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg"
                placeholder="(305) 555-0100"
                value={newInspection.contactPhone}
                onChange={(e) => setNewInspection({...newInspection, contactPhone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Contact Name *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Site supervisor or contractor name"
              value={newInspection.contactName}
              onChange={(e) => setNewInspection({...newInspection, contactName: e.target.value})}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Miami-Dade Specific Requirements</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newInspection.hvhzZone}
                  onChange={(e) => setNewInspection({...newInspection, hvhzZone: e.target.checked})}
                  className="w-5 h-5"
                />
                <span className="text-sm">Property is in High Velocity Hurricane Zone (HVHZ) - 175 mph wind rating required</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newInspection.floodZone}
                  onChange={(e) => setNewInspection({...newInspection, floodZone: e.target.checked})}
                  className="w-5 h-5"
                />
                <span className="text-sm">Property is in flood zone - elevation requirements apply</span>
              </label>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <div className="font-semibold mb-1">Scheduling Requirements:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Must schedule by 4:00 PM the day before inspection</li>
                  <li>Contact inspector between 7:00-8:00 AM day of inspection</li>
                  <li>Routes are finalized 7:30-8:15 AM - times may change</li>
                  <li>Inspections available Monday-Friday, 8:00 AM - 3:30 PM</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                generateElectricalChecklist(newInspection.inspectionType);
              }}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
            >
              <CheckSquare className="h-5 w-5" />
              Generate Pre-Inspection Checklist
            </button>
            <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Schedule Inspection
            </button>
          </div>
        </div>
      </div>

      {checklistItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-8 mt-6">
          <h2 className="text-2xl font-bold mb-6">AI-Generated Pre-Inspection Checklist</h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <p className="text-sm text-blue-800">
              ✓ Checklist customized for Miami-Dade County electrical codes and HVHZ requirements
            </p>
          </div>
          
          <div className="space-y-3">
            {checklistItems.map(item => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50 ${
                  item.critical ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    setChecklistItems(checklistItems.map(i => 
                      i.id === item.id ? {...i, checked: e.target.checked} : i
                    ));
                  }}
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.item}</span>
                    {item.critical && (
                      <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs font-semibold rounded">
                        CRITICAL
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-semibold text-green-800 mb-2">
              Checklist Progress: {checklistItems.filter(i => i.checked).length} / {checklistItems.length} items completed
            </div>
            <div className="text-sm text-green-700">
              Critical items remaining: {checklistItems.filter(i => i.critical && !i.checked).length}
            </div>
          </div>
        </div>
      )}

      {generatingChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Generating AI Checklist</h3>
              <p className="text-gray-600">Analyzing Miami-Dade electrical codes and HVHZ requirements...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const DocumentsView = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Inspection Documents & Photos</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <div className="font-semibold mb-1">Upload Site Photos</div>
              <div className="text-sm text-gray-500">GPS & timestamp automatic</div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <div className="font-semibold mb-1">Upload NOA Docs</div>
              <div className="text-sm text-gray-500">Miami-Dade approvals</div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <div className="font-semibold mb-1">Upload Plans</div>
              <div className="text-sm text-gray-500">Approved electrical plans</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Miami Construction Inspector Pro</h1>
          <p className="text-blue-100">Electrical Inspection Tracking & Management System</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-6 py-4 font-semibold ${activeTab === 'new' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Schedule Inspection
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-4 font-semibold ${activeTab === 'documents' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Documents
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'new' && <NewInspectionView />}
        {activeTab === 'documents' && <DocumentsView />}
      </div>
    </div>
  );
};

export default App;
