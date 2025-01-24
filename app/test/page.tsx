<Card>
        <CardHeader>
          <CardTitle className="mb-6">
            <div className="text-left flex items-center space-x-2">
              <Hospital className="text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold">Hospital Visits list</h1>
                <p className="text-sm text-gray-600">Track all visits here</p>
              </div>
            </div>
          </CardTitle>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-1/3">
              <Input
                type="text"
                placeholder="Search by patient name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddVisit}>Add Visit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Visit</DialogTitle>
                    <DialogDescription>
                      {/* Form elements for adding a new visit */}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <AddVisitPage />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDialogClose}>Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleRegisterPatient}>Register Patient</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                    <DialogDescription>
                      {/* Form elements for registering a new patient */}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <PatientRegistrationForm />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDialogClose}>Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inpatient">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inpatient">Inpatient Visits</TabsTrigger>
              <TabsTrigger value="outpatient">Outpatient Visits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inpatient">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visit ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Primary Doctor</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Expected Discharge</TableHead>
                    <TableHead>Initial Status</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Bed ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Old / New</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInpatientVisits.map((visit) => (
                    <TableRow key={visit.visit_id}>
                      <TableCell>{visit.visit_id}</TableCell>
                      <TableCell>{visit.patient_name}</TableCell>
                      <TableCell>{visit.primary_doctor}</TableCell>
                      <TableCell>{visit.visit_date}</TableCell>
                      <TableCell>{visit.admission_date}</TableCell>
                      <TableCell>{visit.expected_discharge_date}</TableCell>
                      <TableCell>{visit.status}</TableCell>
                      <TableCell>{visit.current_status || 'TBD'}</TableCell>
                      <TableCell>{visit.bed_id}</TableCell>
                      <TableCell>{visit.department}</TableCell>
                      <TableCell>
                        <Badge variant={isNewVisit(visit.visit_date) ? 'default' : 'secondary'}>
                          {isNewVisit(visit.visit_date) ? 'New' : 'Old'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="outpatient">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visit ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Primary Doctor</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Old / New</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutpatientVisits.map((visit) => (
                    <TableRow key={visit.visit_id}>
                      <TableCell>{visit.visit_id}</TableCell>
                      <TableCell>{visit.patient_name}</TableCell>
                      <TableCell>{visit.primary_doctor}</TableCell>
                      <TableCell>{visit.visit_date}</TableCell>
                      <TableCell>{visit.department}</TableCell>
                      <TableCell>
                        <Badge variant={isNewVisit(visit.visit_date) ? 'default' : 'secondary'}>
                          {isNewVisit(visit.visit_date) ? 'New' : 'Old'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>